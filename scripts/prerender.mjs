// Static prerender of every route into dist/<route>/index.html using headless Chromium (Playwright).
// Run after `npm run build`. The client still boots with createRoot and replaces the markup.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { chromium } from 'playwright-core';

const dist = path.resolve('dist');
const routes = JSON.parse(fs.readFileSync('src/content/routes.json', 'utf8'));
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.jpeg': 'image/jpeg', '.png': 'image/png', '.txt': 'text/plain', '.xml': 'application/xml' };

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x').pathname;
  let file = path.join(dist, url);
  if (!file.startsWith(dist)) return res.writeHead(403).end();
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(dist, 'index.html');
  res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(4799, r));

const shell = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
await ctx.addInitScript(() => { window.__PRERENDER__ = true; });
let ok = 0;
for (const r of routes) {
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://localhost:4799' + r, { waitUntil: 'networkidle' });
  await page.waitForSelector('main h1', { timeout: 10000 });
  await page.waitForTimeout(500);
  let html = await page.evaluate(() => '<!doctype html>\n' + document.documentElement.outerHTML);
  // keep the module script so the client boots, drop nothing else
  const out = path.join(dist, r === '/' ? 'index.html' : path.join(r, 'index.html'));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  if (errors.length) console.warn('page errors on', r, errors);
  ok++;
  await page.close();
}
fs.writeFileSync(path.join(dist, '404.html'), shell);
await browser.close();
server.close();
console.log(`prerendered ${ok}/${routes.length} routes`);
