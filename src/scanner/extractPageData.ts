import { load } from 'cheerio';
import type { PageData, ScanPage } from '../engine/ruleTypes.js';
import { isInternalLink } from '../utils/links.js';
import { parseSchemaTypesFromJsonLd } from '../utils/schema.js';

export function extractPageData(rootUrl: string, page: ScanPage, rendered?: { html?: string; ctaPositions: Record<string, number>; error?: string }): PageData {
  const $ = load(page.html);
  const rendered$ = rendered?.html ? load(rendered.html) : undefined;

  const title = $('title').first().text().trim() || undefined;
  const metaDescription = $('meta[name="description"]').attr('content')?.trim();
  const canonical = $('link[rel="canonical"]').attr('href')?.trim();
  const h1s = $('h1').toArray().map((el) => $(el).text().trim()).filter(Boolean);
  const headings = $('h1,h2,h3,h4,h5,h6').toArray().map((el) => ({
    level: Number.parseInt(el.tagName.replace('h', ''), 10),
    text: $(el).text().trim(),
  }));

  const navTexts = $('nav a').toArray().map((el) => $(el).text().trim()).filter(Boolean);
  const footerTexts = $('footer').text().split(/\s+/).filter(Boolean);

  const links = $('a[href]').toArray().map((el) => {
    const href = $(el).attr('href') ?? '';
    const text = $(el).text().trim();
    return {
      href,
      text,
      internal: isInternalLink(rootUrl, href),
      isTel: href.startsWith('tel:'),
    };
  });

  const ctaSource = rendered$ ?? $;
  const ctas = ctaSource('a,button,input[type="submit"]').toArray().map((el) => {
    const text = ctaSource(el).text().trim() || ctaSource(el).attr('value')?.trim() || '';
    return {
      text,
      href: ctaSource(el).attr('href')?.trim(),
      y: rendered?.ctaPositions[text.toLowerCase()],
    };
  }).filter((cta) => Boolean(cta.text));

  const forms = $('form').toArray().map((form) => ({
    fieldCount: $(form).find('input,select,textarea').length,
    submitText: $(form).find('button[type="submit"],input[type="submit"]').first().text().trim() || $(form).find('input[type="submit"]').first().attr('value')?.trim(),
  }));

  const schemaBlocks = $('script[type="application/ld+json"]').toArray().map((el) => $(el).text());
  const metadata: Record<string, string> = {};
  $('meta').each((_, el) => {
    const name = $(el).attr('name') || $(el).attr('property');
    const content = $(el).attr('content');
    if (name && content) metadata[name.toLowerCase()] = content;
  });

  const images = $('img').toArray().map((el) => ({ src: $(el).attr('src'), alt: $(el).attr('alt') }));

  return {
    url: page.url,
    status: page.status,
    title,
    metaDescription,
    canonical,
    h1s,
    headings,
    navTexts,
    footerTexts,
    links,
    ctas,
    forms,
    bodyText: $('body').text(),
    viewport: $('meta[name="viewport"]').attr('content') ?? undefined,
    lang: $('html').attr('lang') ?? undefined,
    schemaTypes: parseSchemaTypesFromJsonLd(schemaBlocks),
    hasNoIndex: $('meta[name="robots"]').attr('content')?.toLowerCase().includes('noindex') ?? false,
    metadata,
    images,
    hasFavicon: $('link[rel*="icon"]').length > 0,
    renderError: rendered?.error,
    pageLoadMs: page.loadMs,
  };
}
