// Open Food Facts: free, no API key. https://openfoodfacts.github.io/openfoodfacts-server/api/
export interface OffProduct {
  name: string;
  brand: string;
  portion: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  basis: "serving" | "100g";
}

/** EAN-8, UPC-A (12), EAN-13 and GTIN-14 mod-10 check. */
export function validBarcode(code: string): boolean {
  if (!/^\d{8}$|^\d{12,14}$/.test(code)) return false;
  const d = code.split("").map(Number);
  const check = d.pop()!;
  const sum = d.reverse().reduce((acc, v, i) => acc + v * (i % 2 === 0 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10 === check;
}

const num = (v: unknown) => {
  const x = typeof v === "string" ? parseFloat(v) : (v as number);
  return typeof x === "number" && Number.isFinite(x) && x >= 0 ? x : undefined;
};

export function parseProduct(p: any): OffProduct | null {
  if (!p) return null;
  const nu = p.nutriments ?? {};
  const kcalServing = num(nu["energy-kcal_serving"]);
  const kcal100 = num(nu["energy-kcal_100g"]) ?? (num(nu["energy_100g"]) !== undefined ? num(nu["energy_100g"])! / 4.184 : undefined);
  const useServing = kcalServing !== undefined;
  if (!useServing && kcal100 === undefined) return null;

  const pick = (k: string) => (useServing ? num(nu[`${k}_serving`]) : num(nu[`${k}_100g`])) ?? 0;
  const servingText = String(p.serving_size ?? "").trim();
  return {
    name: String(p.product_name ?? "").trim() || "Unnamed product",
    brand: String(p.brands ?? "").split(",")[0].trim(),
    portion: useServing ? `1 serving${servingText ? ` (${servingText})` : ""}` : "100 g",
    calories: useServing ? kcalServing! : kcal100!,
    protein_g: pick("proteins"),
    carbs_g: pick("carbohydrates"),
    fat_g: pick("fat"),
    basis: useServing ? "serving" : "100g",
  };
}

export async function lookupBarcode(code: string): Promise<OffProduct | null> {
  const fields = "product_name,brands,nutriments,serving_size";
  const url = `https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=${fields}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "CalorieSnap/1.0 (personal calorie tracker)" },
    signal: AbortSignal.timeout(10_000),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Open Food Facts returned ${res.status}`);
  const json: any = await res.json();
  if (json.status === 0) return null;
  return parseProduct(json.product);
}
