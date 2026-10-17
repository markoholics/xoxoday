import type { IncomingMessage, ServerResponse } from "node:http";
import { timingSafeEqual } from "node:crypto";
import * as store from "./store.js";
import { analyzeImage, VisionError, type VisionResult } from "./vision.js";
import { lookupBarcode, validBarcode } from "./off.js";

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

type Req = IncomingMessage & { body?: unknown };

const MAX_IMAGE_BYTES = 3_500_000; // Vercel request bodies cap at 4.5 MB
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

async function readJson(req: Req): Promise<any> {
  if (req.body !== undefined && req.body !== null) {
    return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  }
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const c of req) {
    size += (c as Buffer).length;
    if (size > 6_000_000) throw new HttpError(413, "Request too large");
    chunks.push(c as Buffer);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function authorized(req: Req, url: URL): boolean {
  const pw = process.env.APP_PASSWORD;
  if (!pw) return true;
  const given = String(req.headers["x-app-password"] ?? url.searchParams.get("p") ?? "");
  const a = Buffer.from(given);
  const b = Buffer.from(pw);
  return a.length === b.length && timingSafeEqual(a, b);
}

const finite = (v: unknown, label: string, max = 100_000): number => {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > max) throw new HttpError(400, `${label} must be a number between 0 and ${max}`);
  return v;
};

function parseDataUrl(s: unknown): { mime: string; b64: string } {
  const m = typeof s === "string" ? /^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/.exec(s) : null;
  if (!m) throw new HttpError(400, "image must be a base64 data URL (jpeg, png, webp or gif)");
  if (m[2].length * 0.75 > MAX_IMAGE_BYTES) throw new HttpError(413, "Image is too large");
  return { mime: m[1], b64: m[2] };
}

function itemsFromVision(v: VisionResult): store.NewItem[] {
  if (v.kind === "meal") {
    return v.items.map((i) => ({
      name: i.name,
      portion: i.portion,
      calories: i.calories,
      protein: i.protein_g,
      carbs: i.carbs_g,
      fat: i.fat_g,
      source: "estimated" as const,
    }));
  }
  if (v.kind === "packaged") {
    const l = v.label;
    const k = l.servings_eaten;
    if (!(l.calories_per_serving > 0)) return [];
    return [
      {
        name: l.product_name || v.title || "Packaged food",
        portion: k === 1 ? l.serving_size || "1 serving" : `${k} × ${l.serving_size || "serving"}`,
        calories: l.calories_per_serving * k,
        protein: l.protein_g_per_serving * k,
        carbs: l.carbs_g_per_serving * k,
        fat: l.fat_g_per_serving * k,
        source: "label" as const,
      },
    ];
  }
  return [];
}

async function analyze(body: any) {
  const day = String(body.day ?? "");
  if (!DAY_RE.test(day)) throw new HttpError(400, "day must be YYYY-MM-DD");

  let vision: VisionResult | null = null;
  let imageId: number | null = null;
  let code = "";

  if (body.image) {
    const { mime, b64 } = parseDataUrl(body.image);
    try {
      vision = await analyzeImage(mime, b64);
    } catch (e) {
      if (e instanceof VisionError) throw new HttpError(502, e.message);
      throw e;
    }
    if (vision.kind === "unknown")
      throw new HttpError(422, vision.notes || "That doesn't look like food, a nutrition label or a barcode. Try a clearer photo.");
    code = vision.kind === "barcode" ? vision.barcode : "";
    imageId = await store.saveImage(mime, b64);
  } else if (body.barcode) {
    code = String(body.barcode).replace(/\D/g, "");
  } else {
    throw new HttpError(400, "Provide an image or a barcode");
  }

  // Everything below can fail after the image row exists; clean it up so we don't orphan it.
  const fail = async (status: number, msg: string): Promise<never> => {
    if (imageId != null) {
      const c = await (await import("./db.js")).db();
      await c.execute({ sql: "DELETE FROM images WHERE id = ?", args: [imageId] });
    }
    throw new HttpError(status, msg);
  };

  if (!vision || vision.kind === "barcode") {
    if (!code) return fail(422, "Couldn't read the barcode digits. Try a sharper, closer photo, or type the number in.");
    if (!validBarcode(code)) return fail(422, `"${code}" isn't a valid barcode number (check digit failed). Try again or type it in.`);
    let product;
    try {
      product = await lookupBarcode(code);
    } catch (e) {
      return fail(502, `Barcode lookup failed: ${(e as Error).message}`);
    }
    if (!product) return fail(404, `Barcode ${code} isn't in Open Food Facts yet. Try photographing the nutrition label instead.`);
    return store.createEntry({
      day,
      kind: "barcode",
      title: product.brand ? `${product.name} (${product.brand})` : product.name,
      barcode: code,
      notes: product.basis === "100g" ? "No per-serving data in Open Food Facts; values are per 100 g. Adjust to what you ate." : null,
      imageId,
      items: [
        {
          name: product.name,
          portion: product.portion,
          calories: product.calories,
          protein: product.protein_g,
          carbs: product.carbs_g,
          fat: product.fat_g,
          source: "barcode",
        },
      ],
    });
  }

  const items = itemsFromVision(vision);
  if (!items.length)
    return fail(422, vision.kind === "packaged" ? "Couldn't read calories from that label. Try a flatter, sharper photo." : "No food items were detected in that photo.");
  return store.createEntry({
    day,
    kind: vision.kind,
    title: vision.title || items[0].name,
    notes: vision.notes || null,
    imageId,
    items,
  });
}

export async function handle(req: Req, res: ServerResponse): Promise<void> {
  try {
    const url = new URL(req.url ?? "/", "http://x");
    const path = url.pathname.replace(/^\/api\/?/, "").replace(/\/$/, "");
    const parts = path.split("/").filter(Boolean);
    const method = req.method ?? "GET";

    if (!authorized(req, url)) return send(res, 401, { error: "Password required" });

    // GET /api/auth  (used by the login screen)
    if (path === "auth" && method === "GET") return send(res, 200, { ok: true, protected: !!process.env.APP_PASSWORD });

    // GET /api/day?day=
    if (path === "day" && method === "GET") {
      const day = url.searchParams.get("day") ?? "";
      if (!DAY_RE.test(day)) throw new HttpError(400, "day must be YYYY-MM-DD");
      const [target, entries] = await Promise.all([store.getTarget(), store.entriesForDay(day)]);
      return send(res, 200, { target, ...store.summarize(day, entries) });
    }

    // GET /api/history?before=&limit=
    if (path === "history" && method === "GET") {
      const before = url.searchParams.get("before");
      if (before && !DAY_RE.test(before)) throw new HttpError(400, "before must be YYYY-MM-DD");
      const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") ?? "7", 10) || 7, 1), 31);
      const [target, page] = await Promise.all([store.getTarget(), store.historyPage(before, limit)]);
      return send(res, 200, { target, ...page });
    }

    if (path === "settings" && method === "PUT") {
      const body = await readJson(req);
      const t = finite(body.target, "target", 20_000);
      if (t < 500) throw new HttpError(400, "target must be at least 500 kcal");
      await store.setTarget(t);
      return send(res, 200, { target: Math.round(t) });
    }

    if (path === "analyze" && method === "POST") {
      return send(res, 201, await analyze(await readJson(req)));
    }

    if (parts[0] === "image" && parts[1] && method === "GET") {
      const img = await store.getImage(Number(parts[1]));
      if (!img) throw new HttpError(404, "Not found");
      res.statusCode = 200;
      res.setHeader("Content-Type", img.mime);
      res.setHeader("Cache-Control", "private, max-age=31536000, immutable");
      res.end(img.data);
      return;
    }

    if (parts[0] === "entries" && parts[1]) {
      const id = Number(parts[1]);
      if (!Number.isInteger(id)) throw new HttpError(400, "Bad id");
      if (method === "GET") {
        const e = await store.getEntry(id);
        if (!e) throw new HttpError(404, "Entry not found");
        return send(res, 200, e);
      }
      if (method === "DELETE") {
        if (!(await store.deleteEntry(id))) throw new HttpError(404, "Entry not found");
        return send(res, 200, { ok: true });
      }
    }

    if (parts[0] === "items" && parts[1]) {
      const id = Number(parts[1]);
      if (!Number.isInteger(id)) throw new HttpError(400, "Bad id");

      if (parts[2] === "reset" && method === "POST") {
        const e = await store.resetItem(id);
        if (!e) throw new HttpError(404, "Item not found");
        return send(res, 200, e);
      }
      if (!parts[2] && method === "PATCH") {
        const b = await readJson(req);
        const patch: store.ItemPatch = {};
        if (b.name !== undefined) {
          if (typeof b.name !== "string" || !b.name.trim() || b.name.length > 120) throw new HttpError(400, "name must be 1-120 characters");
          patch.name = b.name;
        }
        if (b.portion !== undefined) {
          if (typeof b.portion !== "string" || b.portion.length > 120) throw new HttpError(400, "portion is too long");
          patch.portion = b.portion;
        }
        if (b.calories !== undefined) patch.calories = finite(b.calories, "calories", 20_000);
        if (b.protein !== undefined) patch.protein = finite(b.protein, "protein", 5_000);
        if (b.carbs !== undefined) patch.carbs = finite(b.carbs, "carbs", 5_000);
        if (b.fat !== undefined) patch.fat = finite(b.fat, "fat", 5_000);
        const e = await store.patchItem(id, patch);
        if (!e) throw new HttpError(404, "Item not found");
        return send(res, 200, e);
      }
      if (!parts[2] && method === "DELETE") {
        const r = await store.deleteItem(id);
        if (!r.found) throw new HttpError(404, "Item not found");
        return send(res, 200, { entry: r.entry });
      }
    }

    throw new HttpError(404, "Not found");
  } catch (e) {
    if (e instanceof HttpError) return send(res, e.status, { error: e.message });
    if (e instanceof SyntaxError) return send(res, 400, { error: "Invalid JSON" });
    console.error(e);
    send(res, 500, { error: (e as Error).message || "Server error" });
  }
}
