# Loyalife by Xoxoday microsite

React, Tailwind, Framer Motion, Vite. Frontend only.

```
npm install
npm run dev            # develop
npm run build          # typecheck + build (also regenerates sitemap.xml and robots.txt)
npm run build:static   # build + prerender every route (needs Chromium)
```

- Copy and data: `src/content/*` (typed). Flags: `src/config/features.ts`. AI chip statuses: `src/config/status.ts`.
- Brand tokens: `src/styles/tokens.css`. Motion tokens: `src/lib/motion.ts`.
- Events: `src/lib/events.ts` (typed catalogue, `subscribe`), forwarded by `src/lib/analytics.ts`.
- URL switches: `?review=1` (review mode), `?explorer=off` (disable Explorer Mode).
- See `CONFIRM.md` for open items.
