// Generates public/sitemap.xml and public/robots.txt from src/content/routes.json
import fs from 'node:fs';
const routes = JSON.parse(fs.readFileSync('src/content/routes.json', 'utf8'));
const base = process.env.SITE_URL || 'https://loyalife.example'; // PLACEHOLDER, see CONFIRM.md
const date = '2026-10-03';
const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  routes.map((r) => `  <url><loc>${base}${r === '/' ? '/' : r}</loc><lastmod>${date}</lastmod></url>`).join('\n') +
  '\n</urlset>\n';
fs.writeFileSync('public/sitemap.xml', xml);
fs.writeFileSync('public/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);
console.log(`sitemap: ${routes.length} routes`);
