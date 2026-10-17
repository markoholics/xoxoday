export function localDay(d = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function dayLabel(day: string): string {
  const today = localDay();
  const y = new Date();
  y.setDate(y.getDate() - 1);
  if (day === today) return "Today";
  if (day === localDay(y)) return "Yesterday";
  const [yy, mm, dd] = day.split("-").map(Number);
  return new Date(yy, mm - 1, dd).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

export const timeLabel = (iso: string) => new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

/** Downscale to <=1568px on the long edge (Claude's sweet spot) and re-encode as JPEG to keep uploads small. */
export async function toDataUrl(blob: Blob, maxEdge = 1568): Promise<string> {
  let bmp: ImageBitmap;
  try {
    bmp = await createImageBitmap(blob, { imageOrientation: "from-image" });
  } catch {
    throw new Error("That file couldn't be read as an image.");
  }
  const scale = Math.min(1, maxEdge / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  return canvas.toDataURL("image/jpeg", 0.85);
}

export const fmt = (n: number) => (Math.round(n * 10) / 10).toString();
export const KIND_LABEL = { meal: "Meal", packaged: "Label", barcode: "Barcode" } as const;
