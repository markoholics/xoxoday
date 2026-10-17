import { mkdirSync } from "node:fs";
import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;
let ready: Promise<void> | null = null;

function getClient(): Client {
  if (client) return client;
  let url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    if (process.env.VERCEL) {
      throw new Error(
        "TURSO_DATABASE_URL is not set. Vercel's filesystem is ephemeral, so create a free Turso database and set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.",
      );
    }
    mkdirSync("./data", { recursive: true });
    url = "file:./data/calorie.db";
  }
  client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN || undefined });
  return client;
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mime TEXT NOT NULL,
    data_b64 TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    day TEXT NOT NULL,
    kind TEXT NOT NULL,
    title TEXT NOT NULL,
    barcode TEXT,
    notes TEXT,
    image_id INTEGER REFERENCES images(id),
    total_calories REAL NOT NULL DEFAULT 0,
    total_protein REAL NOT NULL DEFAULT 0,
    total_carbs REAL NOT NULL DEFAULT 0,
    total_fat REAL NOT NULL DEFAULT 0
  )`,
  `CREATE INDEX IF NOT EXISTS idx_entries_day ON entries(day, created_at)`,
  `CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_id INTEGER NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    portion TEXT NOT NULL DEFAULT '',
    calories REAL NOT NULL DEFAULT 0,
    protein REAL NOT NULL DEFAULT 0,
    carbs REAL NOT NULL DEFAULT 0,
    fat REAL NOT NULL DEFAULT 0,
    source TEXT NOT NULL DEFAULT 'estimated',
    edited INTEGER NOT NULL DEFAULT 0,
    orig_calories REAL NOT NULL DEFAULT 0,
    orig_protein REAL NOT NULL DEFAULT 0,
    orig_carbs REAL NOT NULL DEFAULT 0,
    orig_fat REAL NOT NULL DEFAULT 0
  )`,
  `CREATE INDEX IF NOT EXISTS idx_items_entry ON items(entry_id)`,
  `CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`,
];

export async function db(): Promise<Client> {
  const c = getClient();
  if (!ready) {
    ready = (async () => {
      await c.batch(SCHEMA, "write");
    })();
    ready.catch(() => (ready = null));
  }
  await ready;
  return c;
}

/** Test hook: swap the client (e.g. in-memory DB). */
export function __resetForTests(url: string) {
  client = createClient({ url });
  ready = null;
}
