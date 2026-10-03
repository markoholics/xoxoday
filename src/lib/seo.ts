import { useEffect } from 'react';
import { SEO } from '@/content/seo';
import { SITE } from '@/content/site';
import { SOLUTIONS } from '@/content/solutions';
import { STORIES } from '@/content/site';

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

export function setJsonLd(id: string, data: object | null) {
  const sel = `script[data-ld="${id}"]`;
  let el = document.head.querySelector<HTMLScriptElement>(sel);
  if (!data) return el?.remove();
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.setAttribute('data-ld', id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/** Per route title, description, Open Graph, canonical and JSON LD. */
export function useSeo(path: string, override?: { title?: string; description?: string }) {
  useEffect(() => {
    let m = SEO[path];
    if (!m) {
      const sol = SOLUTIONS.find((x) => path === '/solutions/' + x.slug);
      const story = STORIES.find((x) => path === '/resources/case-studies/' + x.id);
      if (sol) m = { title: sol.label, description: `${sol.headline} ${sol.outcome}` };
      else if (story) m = { title: `${story.company} case study`, description: `${story.company}: ${story.topic}. Read the published quote.` };
      else m = { title: 'Page not found', description: SEO['/'].description };
    }
    const title = override?.title ?? m.title;
    const desc = override?.description ?? m.description;
    const full = path === '/' ? `${SITE.name}: ${title}` : `${title} | ${SITE.name}`;
    document.title = full;
    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', full);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', SITE.name);
    setMeta('property', 'og:url', SITE.url + path);
    setMeta('name', 'twitter:card', 'summary');
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = SITE.url + path;
    setJsonLd('org', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Xoxoday',
      legalName: 'Nreach Online Services Pvt Ltd',
      url: SITE.url,
    });
    setJsonLd('app', {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: SITE.name,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web, iOS, Android',
      description: SEO['/'].description,
      publisher: { '@type': 'Organization', name: 'Xoxoday' },
    });
  }, [path, override?.title, override?.description]);
}
