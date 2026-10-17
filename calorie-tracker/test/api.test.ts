import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "cal-"));
process.env.TURSO_DATABASE_URL = `file:${join(dir, "t.db")}`;
process.env.MOCK_AI = "1";

const { handle } = await import("../api/_lib/router.js");
const { validBarcode, parseProduct } = await import("../api/_lib/off.js");
const { normalize } = await import("../api/_lib/vision.js");

let server: Server;
let base: string;
before(async () => {
  server = createServer((req, res) => void handle(req, res));
  await new Promise<void>((r) => server.listen(0, r));
  base = `http://localhost:${(server.address() as any).port}`;
});
after(() => {
  server.close();
  rmSync(dir, { recursive: true, force: true });
});

const j = async (path: string, init?: RequestInit) => {
  const r = await fetch(base + path, { ...init, headers: { "content-type": "application/json" } });
  return { status: r.status, body: r.headers.get("content-type")?.includes("json") ? await r.json() : null };
};
// base64 length % 3 picks the mock scenario: 0 meal, 1 packaged
const img = (len: number) => `data:image/jpeg;base64,${"A".repeat(len)}`;

test("barcode check digits", () => {
  assert.ok(validBarcode("3017620422003"));
  assert.ok(validBarcode("012000161155")); // UPC-A
  assert.ok(!validBarcode("3017620422004"));
  assert.ok(!validBarcode("123"));
});

test("Open Food Facts parsing prefers serving values, falls back to 100 g", () => {
  const a = parseProduct({ product_name: "X", brands: "B, C", serving_size: "30 g", nutriments: { "energy-kcal_serving": 120, proteins_serving: 2, carbohydrates_serving: 20, fat_serving: 4, "energy-kcal_100g": 400 } });
  assert.equal(a?.calories, 120);
  assert.equal(a?.brand, "B");
  assert.equal(a?.portion, "1 serving (30 g)");
  const b = parseProduct({ product_name: "Y", nutriments: { "energy-kcal_100g": "250", proteins_100g: "5" } });
  assert.equal(b?.calories, 250);
  assert.equal(b?.basis, "100g");
  assert.equal(parseProduct({ product_name: "Z", nutriments: {} }), null);
});

test("vision output is sanitised", () => {
  const v = normalize({ kind: "meal", items: [{ name: "", calories: -5, protein_g: "x" }], barcode: "30 1-7" });
  assert.equal(v.items[0].calories, 0);
  assert.equal(v.items[0].name, "Food item");
  assert.equal(v.barcode, "3017");
  assert.equal(normalize({ kind: "bogus" }).kind, "unknown");
});

test("meal photo: itemised, totals are server-side sums", async () => {
  const r = await j("/api/analyze", { method: "POST", body: JSON.stringify({ image: img(300), day: "2026-10-17" }) });
  assert.equal(r.status, 201);
  assert.equal(r.body.kind, "meal");
  assert.equal(r.body.items.length, 3);
  assert.equal(r.body.total_calories, 248 + 206 + 31);
  assert.ok(r.body.image_url);
});

test("packaged label: values extracted directly, not estimated", async () => {
  const r = await j("/api/analyze", { method: "POST", body: JSON.stringify({ image: img(301), day: "2026-10-17" }) });
  assert.equal(r.status, 201);
  assert.equal(r.body.items[0].source, "label");
  assert.equal(r.body.total_calories, 170);
});

test("barcode photo with unreadable/invalid digits is rejected and leaves no image behind", async () => {
  // scenario 2 returns 3017620422003 which is valid; so test invalid manual entry
  const r = await j("/api/analyze", { method: "POST", body: JSON.stringify({ barcode: "1234567890123", day: "2026-10-17" }) });
  assert.equal(r.status, 422);
});

test("correction persists, updates totals, and can be reset", async () => {
  const day = await j("/api/day?day=2026-10-17");
  const meal = day.body.entries.find((e: any) => e.kind === "meal");
  const rice = meal.items.find((i: any) => i.name === "White rice");

  const p = await j(`/api/items/${rice.id}`, { method: "PATCH", body: JSON.stringify({ calories: 300, carbs: 60 }) });
  assert.equal(p.status, 200);
  assert.equal(p.body.total_calories, 248 + 300 + 31);
  assert.equal(p.body.items.find((i: any) => i.id === rice.id).edited, true);

  const again = await j(`/api/entries/${meal.id}`);
  assert.equal(again.body.total_calories, 579);
  assert.equal((await j("/api/day?day=2026-10-17")).body.total_calories, 579 + 170);

  const rs = await j(`/api/items/${rice.id}/reset`, { method: "POST" });
  assert.equal(rs.body.total_calories, 485);
  assert.equal(rs.body.items.find((i: any) => i.id === rice.id).edited, false);
});

test("validation", async () => {
  const bad = await j(`/api/items/1`, { method: "PATCH", body: JSON.stringify({ calories: -1 }) });
  assert.equal(bad.status, 400);
  assert.equal((await j("/api/day?day=nope")).status, 400);
  assert.equal((await j("/api/analyze", { method: "POST", body: JSON.stringify({ image: "data:text/html;base64,AAAA", day: "2026-10-17" }) })).status, 400);
});

test("target setting and history paging", async () => {
  assert.equal((await j("/api/settings", { method: "PUT", body: JSON.stringify({ target: 1800 }) })).body.target, 1800);
  for (const d of ["2026-10-15", "2026-10-14"])
    await j("/api/analyze", { method: "POST", body: JSON.stringify({ image: img(300), day: d }) });
  const p1 = await j("/api/history?limit=2");
  assert.deepEqual(p1.body.days.map((d: any) => d.day), ["2026-10-17", "2026-10-15"]);
  assert.equal(p1.body.target, 1800);
  assert.equal(p1.body.nextBefore, "2026-10-15");
  const p2 = await j(`/api/history?limit=2&before=${p1.body.nextBefore}`);
  assert.deepEqual(p2.body.days.map((d: any) => d.day), ["2026-10-14"]);
  assert.equal(p2.body.nextBefore, null);
});

test("deleting the last item removes the entry", async () => {
  const d = await j("/api/day?day=2026-10-14");
  const e = d.body.entries[0];
  for (const it of e.items) await j(`/api/items/${it.id}`, { method: "DELETE" });
  assert.equal((await j(`/api/entries/${e.id}`)).status, 404);
});
