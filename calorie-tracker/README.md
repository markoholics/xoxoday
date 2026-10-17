# CalorieSnap

Track calories from a photo. React + Vite frontend, Node serverless API, SQLite (libSQL) storage, Claude vision.

- **Plate photo**: Claude classifies it, lists each food separately, estimates each portion and returns calories and macros per item. Totals are summed server-side.
- **Nutrition or ingredient label**: values are read off the label (per serving × servings eaten), not estimated.
- **Barcode**: Claude reads the digits, the check digit is validated, then [Open Food Facts](https://world.openfoodfacts.org) supplies the nutrition data. You can also type a barcode.
- **Dashboard**: today vs. your daily target (editable). **History**: infinite scroll by day.
- **Corrections**: tap any item to edit name, portion, calories or macros. Edits are saved permanently; the original AI/label value is kept and a **Reset** button restores it.
- Camera: live in-browser camera (falls back to the native camera picker), or upload a file. Images are downscaled client-side before upload.

## Run locally

```
cp .env.example .env     # add your ANTHROPIC_API_KEY
npm install
npm run dev              # web on :5173, API on :3001, SQLite at ./data/calorie.db
npm test                 # API tests against a temp SQLite file, AI mocked
```

`MOCK_AI=1` (or `meal` / `packaged` / `barcode`) runs without an API key using canned model output, for UI work.

## Deploy free on Vercel

SQLite files can't persist on Vercel's serverless filesystem, so production uses **Turso** (hosted libSQL, which is SQLite, free tier). The code is identical; only the URL changes.

1. Create a free DB at turso.tech: `turso db create calorie`, then `turso db show calorie --url` and `turso db tokens create calorie`. Tables are created automatically on first request.
2. In Vercel: **Add New → Project**, pick this repo, set **Root Directory** to `calorie-tracker` (Vite is auto-detected).
3. Environment variables:

   | Name | |
   |---|---|
   | `ANTHROPIC_API_KEY` | required |
   | `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` | required |
   | `APP_PASSWORD` | strongly recommended: the URL is public and every photo costs API credits |
   | `ANTHROPIC_MODEL` | optional, default `claude-opus-5-5` (set a Sonnet or Haiku id for cheaper scans) |
   | `AI_FALLBACKS=off` | optional, disables the server-side refusal-fallback beta |

4. Deploy. The API is a single function (`api/[...route].ts`, 60 s max, within the Hobby limit).

Vercel's free Hobby tier is for non-commercial use.

## Layout

```
api/[...route].ts      Vercel entry; all logic in api/_lib/
api/_lib/vision.ts     Claude call: classify + extract, structured JSON output
api/_lib/off.ts        Open Food Facts lookup + barcode check digit
api/_lib/store.ts      SQLite queries (entries, items, images, settings)
api/_lib/router.ts     routes, validation, optional passphrase auth
server/dev.ts          local API server (same router)
src/                   React app
```

Data model: `entries` (timestamp, local day, kind, title, totals, image) → `items` (itemised calories/macros, source, `edited` flag plus the original values). Images are stored in the DB (base64) and served from `/api/image/:id`.
