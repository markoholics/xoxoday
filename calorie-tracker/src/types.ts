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
  kind: "meal" | "packaged" | "barcode";
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

export interface DaySummary {
  day: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  entries: Entry[];
}
