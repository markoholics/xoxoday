# CONFIRM.md

Everything below was a default chosen to keep the build moving. Open any page with `?review=1` to see amber flags beside each item and a panel that lists them all (source: `src/content/flags.ts`).

## Needs your confirmation (claims)
- Scale figures: 65M+ members, $5B+ rewards, 150+ countries, 99.99% uptime (SLA wording), 10M+ options in 30+ categories, 30+ languages, 55+ currencies.
- Speed and cost benchmarks (8 to 12 weeks vs 9 to 12 months, 3 to 5 engineers vs 0 to 1 FTE, about 50% fewer tickets, 30 to 50 countries and about 50,000 options for in house builds). Footnote shown: "Benchmarks from Xoxoday enterprise customers. Your results will vary."
- Certifications PCI-DSS, SOC 2 Type II, ISO 27001: plain text chips only. **Attach certificate or report** for each.
- Deployment (on-prem, hybrid, cloud, VPC, Active-Active DR), Loyalife AI and MCP, on-prem LLM, APIs, integrations: supplied by the Xoxoday team.
- AI status defaults (`src/config/status.ts`): anomaly detection live; AI & MCP, on-prem LLM and tool-calling shown as live and flagged "supplied"; Draft and Simulate proposed (dashed, tooltip "Status to be confirmed by product").
- Customer names are text only. Replace with approved logos and confirm permission. Industry chips on the names (Banking and cards, Channel and manufacturing, Travel and energy) were assigned by us; AAT, Access, BNI and Landco Pacific appear under All only.
- Four quotes, exactly as published today. Case study pages show only the quote; full stories are to be supplied. Solution pages pair each role with the closest available story.
- Glossary definitions were written from the facts.

## Placeholders
- Brand: Cod Gray #0C0A09 (ink), Selective Yellow #FFB200 (accent, primary buttons), Candlelight #FFE01B. Brand blue #1D4ED8 is taken from the supplied logo SVG. Canvas, surface, semantic colors and muted text are the brief's placeholders (success, warning and danger darkened for text contrast). Swap in `src/styles/tokens.css`.
- Only one SVG was supplied (the wordmark). Dark letters use `currentColor` so it works in dark mode.
- Canonical site URL `https://loyalife.example` (sitemap, canonical, JSON LD). Set `SITE_URL` when running `npm run seo` and update `src/content/site.ts`.
- Reply time ("Reply time to be confirmed"), docs link, data residency options, pricing factors, guide placeholders, company links (xoxoday.com).
- Demo slots play a walkthrough built in code (`DemoPlayer` accepts a `src` prop for recorded video).
- Explorer rewards (template pack, printable one pager, priority slot) are placeholders. `features.realRewards` is false.
- Region chip in the footer only changes labels and the analytics `region` field.

## Simulated (labelled "Sample data" or "Sample output")
Control room, approval queue, command bar output, AI studio, MCP tool call, sandbox, mock screens, region rewards, deployment diagram, security demos, API explorer, estimator, leaderboard, Ask Loyalife (local keyword retrieval, `features.aiMode` is false).

## Prerendering
Vite builds a client side app. `npm run build:static` additionally prerenders all 26 routes to static HTML with headless Chromium (`scripts/prerender.mjs`), written as `dist/<route>/index.html` plus `404.html`. The client still boots with `createRoot` and replaces the markup, so this is prerendering, not hydration. If your host does not run Chromium at build time, run it in CI.

## Not verified
Lighthouse was not run in this environment. Contrast ratios were calculated for muted, brand and status colors in both themes.
