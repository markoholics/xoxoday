import Anthropic from "@anthropic-ai/sdk";

export type ImageKind = "meal" | "packaged" | "barcode" | "unknown";

export interface VisionItem {
  name: string;
  portion: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface VisionResult {
  kind: ImageKind;
  title: string;
  notes: string;
  /** Meal photos: one entry per distinct food. */
  items: VisionItem[];
  /** Packaged label photos: values exactly as printed, per serving. */
  label: {
    product_name: string;
    serving_size: string;
    servings_eaten: number;
    calories_per_serving: number;
    protein_g_per_serving: number;
    carbs_g_per_serving: number;
    fat_g_per_serving: number;
  };
  /** Barcode photos: the digits printed under the bars, "" if unreadable. */
  barcode: string;
}

const num = { type: "number" } as const;
const str = { type: "string" } as const;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["kind", "title", "notes", "items", "label", "barcode"],
  properties: {
    kind: { type: "string", enum: ["meal", "packaged", "barcode", "unknown"] },
    title: str,
    notes: str,
    items: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "portion", "calories", "protein_g", "carbs_g", "fat_g"],
        properties: { name: str, portion: str, calories: num, protein_g: num, carbs_g: num, fat_g: num },
      },
    },
    label: {
      type: "object",
      additionalProperties: false,
      required: [
        "product_name",
        "serving_size",
        "servings_eaten",
        "calories_per_serving",
        "protein_g_per_serving",
        "carbs_g_per_serving",
        "fat_g_per_serving",
      ],
      properties: {
        product_name: str,
        serving_size: str,
        servings_eaten: num,
        calories_per_serving: num,
        protein_g_per_serving: num,
        carbs_g_per_serving: num,
        fat_g_per_serving: num,
      },
    },
    barcode: str,
  },
} as const;

const SYSTEM = `You are the vision engine of a calorie-tracking app. You receive one photo and must first classify it, then extract nutrition data.

Step 1 - classify "kind":
- "meal": prepared food or drink: a plate, bowl, snack, drink, or several dishes.
- "packaged": a packaged product's nutrition facts panel and/or ingredient label.
- "barcode": a barcode (EAN/UPC) is the main subject, with no readable nutrition panel.
- "unknown": not food-related, or too blurry/dark to use. Explain in "notes".
If a photo shows a nutrition panel AND a barcode, choose "packaged" (printed values beat a lookup).

Step 2 - fill in the matching fields and leave the others empty ("" / 0 / []).

meal:
- List every distinct food or drink as its own item. Do not merge a sauce, side or drink into the main dish unless it is truly mixed in.
- For each, estimate the visible portion using cues (plate size, cutlery, hands, packaging) and put it in "portion", e.g. "1 cup cooked rice, ~160 g".
- calories, protein_g, carbs_g and fat_g are totals for the portion shown, not per 100 g. Whole numbers are fine; keep them physically consistent (about 4 kcal/g protein, 4 kcal/g carbs, 9 kcal/g fat).
- "title" is a short name for the whole meal. In "notes", mention anything uncertain (hidden ingredients, oil, dressings).

packaged:
- Read the values exactly as printed. Do NOT estimate. Use the per-serving column (if only per-100g is printed, compute for the stated serving size, and say so in "notes").
- Fill the "label" object: product_name (or "" if not visible), serving_size as printed, servings_eaten = 1 unless the photo clearly shows the user eats a different amount, and the per-serving calories/protein/carbs/fat.
- "items" stays [].

barcode:
- Put the digits printed under the bars in "barcode" (digits only, no spaces). If you cannot read every digit with confidence, return "" and explain in "notes". Never guess digits.
- "items" stays [] and "label" values are empty/0.

Never refuse a food photo for being unusual. Use 0 for values that are genuinely zero.`;

const MODEL = () => process.env.ANTHROPIC_MODEL || "claude-opus-5-5";

export class VisionError extends Error {}

export async function analyzeImage(mime: string, base64: string): Promise<VisionResult> {
  if (process.env.MOCK_AI) return mockResult(base64);
  if (!process.env.ANTHROPIC_API_KEY) throw new VisionError("ANTHROPIC_API_KEY is not set on the server.");

  const client = new Anthropic();
  const useFallbacks = process.env.AI_FALLBACKS !== "off";

  let response;
  try {
    response = await client.beta.messages.create({
      model: MODEL(),
      max_tokens: 4096,
      system: SYSTEM,
      output_config: { effort: "medium", format: { type: "json_schema", schema: SCHEMA } },
      ...(useFallbacks ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mime as "image/jpeg" | "image/png" | "image/webp" | "image/gif", data: base64 },
            },
            { type: "text", text: "Classify this photo and extract its nutrition data." },
          ],
        },
      ],
    });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) throw new VisionError("The AI service is rate limited. Try again in a moment.");
    if (e instanceof Anthropic.AuthenticationError) throw new VisionError("The server's Anthropic API key was rejected.");
    if (e instanceof Anthropic.APIError) throw new VisionError(`AI request failed (${e.status}): ${e.message}`);
    throw e;
  }

  if (response.stop_reason === "refusal") throw new VisionError("The AI declined to analyse this image.");
  if (response.stop_reason === "max_tokens") throw new VisionError("The AI response was cut off. Try a clearer photo.");

  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") throw new VisionError("The AI returned no result.");
  try {
    return normalize(JSON.parse(text.text));
  } catch {
    throw new VisionError("The AI returned an unreadable result. Please try again.");
  }
}

const n = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v > 0 ? v : 0);
const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Defensive: never trust shape or sign of model output. */
export function normalize(raw: any): VisionResult {
  const kind: ImageKind = ["meal", "packaged", "barcode", "unknown"].includes(raw?.kind) ? raw.kind : "unknown";
  const items: VisionItem[] = Array.isArray(raw?.items)
    ? raw.items
        .map((i: any) => ({
          name: s(i?.name) || "Food item",
          portion: s(i?.portion),
          calories: n(i?.calories),
          protein_g: n(i?.protein_g),
          carbs_g: n(i?.carbs_g),
          fat_g: n(i?.fat_g),
        }))
        .slice(0, 30)
    : [];
  const l = raw?.label ?? {};
  return {
    kind,
    title: s(raw?.title),
    notes: s(raw?.notes),
    items,
    label: {
      product_name: s(l.product_name),
      serving_size: s(l.serving_size),
      servings_eaten: n(l.servings_eaten) || 1,
      calories_per_serving: n(l.calories_per_serving),
      protein_g_per_serving: n(l.protein_g_per_serving),
      carbs_g_per_serving: n(l.carbs_g_per_serving),
      fat_g_per_serving: n(l.fat_g_per_serving),
    },
    barcode: s(raw?.barcode).replace(/\D/g, ""),
  };
}

/** MOCK_AI=1 lets the UI be exercised without an API key. The image's first bytes pick the scenario. */
function mockResult(base64: string): VisionResult {
  const forced = ["meal", "packaged", "barcode"].indexOf(process.env.MOCK_AI ?? "");
  const pick = forced >= 0 ? forced : base64.length % 3;
  if (pick === 0)
    return normalize({
      kind: "meal",
      title: "Grilled chicken plate",
      notes: "Mock result. Oil and dressing unknown.",
      items: [
        { name: "Grilled chicken breast", portion: "1 breast, ~150 g", calories: 248, protein_g: 46, carbs_g: 0, fat_g: 5 },
        { name: "White rice", portion: "1 cup cooked, ~160 g", calories: 206, protein_g: 4, carbs_g: 45, fat_g: 0.4 },
        { name: "Steamed broccoli", portion: "1 cup, ~90 g", calories: 31, protein_g: 2.5, carbs_g: 6, fat_g: 0.3 },
      ],
    });
  if (pick === 1)
    return normalize({
      kind: "packaged",
      title: "Oat Crunch Bar",
      notes: "Mock result.",
      label: { product_name: "Oat Crunch Bar", serving_size: "1 bar (40 g)", servings_eaten: 1, calories_per_serving: 170, protein_g_per_serving: 3, carbs_g_per_serving: 28, fat_g_per_serving: 6 },
    });
  return normalize({ kind: "barcode", title: "Barcode", notes: "Mock result.", barcode: "3017620422003" });
}
