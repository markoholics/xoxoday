import type { Row } from "@libsql/client";
import { db } from "./db.js";

export interface Item {
  id: number;
  entry_id: number;
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  source: "estimated" | "label" | "barcode";
  edited: boolean;
  original: { calories: number; protein: number; carbs: number; fat: number };
}

export interface Entry {
  id: number;
  created_at: string;
  day: string;
  kind: string;
  title: string;
  barcode: string | null;
  notes: string | null;
  image_url: string | null;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  items: Item[];
}

export interface NewItem {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  source: Item["source"];
}

const r1 = (v: number) => Math.round(v * 10) / 10;
const rInt = (v: number) => Math.round(v);

const toItem = (r: Row): Item => ({
  id: Number(r.id),
  entry_id: Number(r.entry_id),
  name: String(r.name),
  portion: String(r.portion),
  calories: Number(r.calories),
  protein: Number(r.protein),
  carbs: Number(r.carbs),
  fat: Number(r.fat),
  source: String(r.source) as Item["source"],
  edited: Number(r.edited) === 1,
  original: {
    calories: Number(r.orig_calories),
    protein: Number(r.orig_protein),
    carbs: Number(r.orig_carbs),
    fat: Number(r.orig_fat),
  },
});

const toEntry = (r: Row, items: Item[]): Entry => ({
  id: Number(r.id),
  created_at: String(r.created_at),
  day: String(r.day),
  kind: String(r.kind),
  title: String(r.title),
  barcode: r.barcode == null ? null : String(r.barcode),
  notes: r.notes == null ? null : String(r.notes),
  image_url: r.image_id == null ? null : `/api/image/${r.image_id}`,
  total_calories: Number(r.total_calories),
  total_protein: Number(r.total_protein),
  total_carbs: Number(r.total_carbs),
  total_fat: Number(r.total_fat),
  items,
});

async function attachItems(rows: Row[]): Promise<Entry[]> {
  if (!rows.length) return [];
  const c = await db();
  const ids = rows.map((r) => Number(r.id));
  const res = await c.execute({
    sql: `SELECT * FROM items WHERE entry_id IN (${ids.map(() => "?").join(",")}) ORDER BY id`,
    args: ids,
  });
  const byEntry = new Map<number, Item[]>();
  for (const row of res.rows) {
    const it = toItem(row);
    byEntry.set(it.entry_id, [...(byEntry.get(it.entry_id) ?? []), it]);
  }
  return rows.map((r) => toEntry(r, byEntry.get(Number(r.id)) ?? []));
}

export async function saveImage(mime: string, b64: string): Promise<number> {
  const c = await db();
  const res = await c.execute({ sql: "INSERT INTO images (mime, data_b64) VALUES (?, ?)", args: [mime, b64] });
  return Number(res.lastInsertRowid);
}

export async function getImage(id: number): Promise<{ mime: string; data: Buffer } | null> {
  const c = await db();
  const res = await c.execute({ sql: "SELECT mime, data_b64 FROM images WHERE id = ?", args: [id] });
  const row = res.rows[0];
  return row ? { mime: String(row.mime), data: Buffer.from(String(row.data_b64), "base64") } : null;
}

export async function createEntry(input: {
  day: string;
  kind: string;
  title: string;
  barcode?: string | null;
  notes?: string | null;
  imageId?: number | null;
  items: NewItem[];
}): Promise<Entry> {
  const c = await db();
  const items = input.items.map((i) => ({
    ...i,
    calories: rInt(i.calories),
    protein: r1(i.protein),
    carbs: r1(i.carbs),
    fat: r1(i.fat),
  }));
  const sum = (k: "calories" | "protein" | "carbs" | "fat") => items.reduce((a, i) => a + i[k], 0);

  const tx = await c.transaction("write");
  try {
    const e = await tx.execute({
      sql: `INSERT INTO entries (created_at, day, kind, title, barcode, notes, image_id,
              total_calories, total_protein, total_carbs, total_fat)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      args: [
        new Date().toISOString(),
        input.day,
        input.kind,
        input.title,
        input.barcode ?? null,
        input.notes ?? null,
        input.imageId ?? null,
        rInt(sum("calories")),
        r1(sum("protein")),
        r1(sum("carbs")),
        r1(sum("fat")),
      ],
    });
    const entryId = Number(e.lastInsertRowid);
    for (const i of items) {
      await tx.execute({
        sql: `INSERT INTO items (entry_id, name, portion, calories, protein, carbs, fat, source,
                orig_calories, orig_protein, orig_carbs, orig_fat)
              VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
        args: [entryId, i.name, i.portion, i.calories, i.protein, i.carbs, i.fat, i.source, i.calories, i.protein, i.carbs, i.fat],
      });
    }
    await tx.commit();
    return (await getEntry(entryId))!;
  } catch (err) {
    await tx.rollback();
    throw err;
  } finally {
    tx.close();
  }
}

export async function getEntry(id: number): Promise<Entry | null> {
  const c = await db();
  const res = await c.execute({ sql: "SELECT * FROM entries WHERE id = ?", args: [id] });
  if (!res.rows.length) return null;
  return (await attachItems(res.rows))[0];
}

export async function entriesForDay(day: string): Promise<Entry[]> {
  const c = await db();
  const res = await c.execute({ sql: "SELECT * FROM entries WHERE day = ? ORDER BY created_at", args: [day] });
  return attachItems(res.rows);
}

export interface DaySummary {
  day: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  entries: Entry[];
}

export function summarize(day: string, entries: Entry[]): DaySummary {
  const t = (k: "total_calories" | "total_protein" | "total_carbs" | "total_fat") => entries.reduce((a, e) => a + e[k], 0);
  return {
    day,
    total_calories: rInt(t("total_calories")),
    total_protein: r1(t("total_protein")),
    total_carbs: r1(t("total_carbs")),
    total_fat: r1(t("total_fat")),
    entries,
  };
}

/** Days that have entries, newest first, strictly before `before` (exclusive). */
export async function historyPage(before: string | null, limit: number): Promise<{ days: DaySummary[]; nextBefore: string | null }> {
  const c = await db();
  const dayRows = await c.execute({
    sql: `SELECT DISTINCT day FROM entries ${before ? "WHERE day < ?" : ""} ORDER BY day DESC LIMIT ?`,
    args: before ? [before, limit + 1] : [limit + 1],
  });
  const all = dayRows.rows.map((r) => String(r.day));
  const days = all.slice(0, limit);
  if (!days.length) return { days: [], nextBefore: null };

  const res = await c.execute({
    sql: `SELECT * FROM entries WHERE day IN (${days.map(() => "?").join(",")}) ORDER BY created_at`,
    args: days,
  });
  const entries = await attachItems(res.rows);
  return {
    days: days.map((d) => summarize(d, entries.filter((e) => e.day === d))),
    nextBefore: all.length > limit ? days[days.length - 1] : null,
  };
}

async function recomputeEntry(entryId: number) {
  const c = await db();
  await c.execute({
    sql: `UPDATE entries SET
            total_calories = COALESCE((SELECT ROUND(SUM(calories)) FROM items WHERE entry_id = ?), 0),
            total_protein  = COALESCE((SELECT ROUND(SUM(protein), 1) FROM items WHERE entry_id = ?), 0),
            total_carbs    = COALESCE((SELECT ROUND(SUM(carbs), 1) FROM items WHERE entry_id = ?), 0),
            total_fat      = COALESCE((SELECT ROUND(SUM(fat), 1) FROM items WHERE entry_id = ?), 0)
          WHERE id = ?`,
    args: [entryId, entryId, entryId, entryId, entryId],
  });
}

export interface ItemPatch {
  name?: string;
  portion?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

/** Persist a manual correction; AI/label original values stay in orig_* so it can be reset. */
export async function patchItem(id: number, p: ItemPatch): Promise<Entry | null> {
  const c = await db();
  const cur = await c.execute({ sql: "SELECT * FROM items WHERE id = ?", args: [id] });
  if (!cur.rows.length) return null;
  const it = toItem(cur.rows[0]);
  const next = {
    name: p.name?.trim() || it.name,
    portion: p.portion !== undefined ? p.portion.trim() : it.portion,
    calories: p.calories !== undefined ? rInt(p.calories) : it.calories,
    protein: p.protein !== undefined ? r1(p.protein) : it.protein,
    carbs: p.carbs !== undefined ? r1(p.carbs) : it.carbs,
    fat: p.fat !== undefined ? r1(p.fat) : it.fat,
  };
  const changed =
    next.calories !== it.original.calories ||
    next.protein !== it.original.protein ||
    next.carbs !== it.original.carbs ||
    next.fat !== it.original.fat;
  await c.execute({
    sql: `UPDATE items SET name=?, portion=?, calories=?, protein=?, carbs=?, fat=?, edited=? WHERE id=?`,
    args: [next.name, next.portion, next.calories, next.protein, next.carbs, next.fat, changed ? 1 : 0, id],
  });
  await recomputeEntry(it.entry_id);
  return getEntry(it.entry_id);
}

export async function resetItem(id: number): Promise<Entry | null> {
  const c = await db();
  const cur = await c.execute({ sql: "SELECT * FROM items WHERE id = ?", args: [id] });
  if (!cur.rows.length) return null;
  const it = toItem(cur.rows[0]);
  await c.execute({
    sql: "UPDATE items SET calories=orig_calories, protein=orig_protein, carbs=orig_carbs, fat=orig_fat, edited=0 WHERE id=?",
    args: [id],
  });
  await recomputeEntry(it.entry_id);
  return getEntry(it.entry_id);
}

/** Returns the entry (or null if it was the last item and the entry was removed). */
export async function deleteItem(id: number): Promise<{ found: boolean; entry: Entry | null }> {
  const c = await db();
  const cur = await c.execute({ sql: "SELECT entry_id FROM items WHERE id = ?", args: [id] });
  if (!cur.rows.length) return { found: false, entry: null };
  const entryId = Number(cur.rows[0].entry_id);
  await c.execute({ sql: "DELETE FROM items WHERE id = ?", args: [id] });
  const left = await c.execute({ sql: "SELECT COUNT(*) AS n FROM items WHERE entry_id = ?", args: [entryId] });
  if (Number(left.rows[0].n) === 0) {
    await deleteEntry(entryId);
    return { found: true, entry: null };
  }
  await recomputeEntry(entryId);
  return { found: true, entry: await getEntry(entryId) };
}

export async function deleteEntry(id: number): Promise<boolean> {
  const c = await db();
  const cur = await c.execute({ sql: "SELECT image_id FROM entries WHERE id = ?", args: [id] });
  if (!cur.rows.length) return false;
  await c.execute({ sql: "DELETE FROM items WHERE entry_id = ?", args: [id] });
  await c.execute({ sql: "DELETE FROM entries WHERE id = ?", args: [id] });
  if (cur.rows[0].image_id != null) await c.execute({ sql: "DELETE FROM images WHERE id = ?", args: [cur.rows[0].image_id] });
  return true;
}

export async function getTarget(): Promise<number> {
  const c = await db();
  const res = await c.execute({ sql: "SELECT value FROM settings WHERE key = 'daily_target'", args: [] });
  return res.rows[0] ? Number(res.rows[0].value) : 2000;
}

export async function setTarget(v: number): Promise<void> {
  const c = await db();
  await c.execute({
    sql: "INSERT INTO settings (key, value) VALUES ('daily_target', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    args: [String(Math.round(v))],
  });
}
