import * as cheerio from 'cheerio';
import { isInternalLink } from '../utils/links.js';
import { cleanText } from '../utils/text.js';
import type { PageData } from '../engine/ruleTypes.js';

export const extractPageData = (
  url: string,
  html: string,
  status: number,
  responseTimeMs: number,
): PageData => {
  const $ = cheerio.load(html);

  const metadata: Record<string, string> = {};
  $('meta').each((_, el) => {
    const key = $(el).attr('name') || $(el).attr('property');
    const value = $(el).attr('content');
    if (key && value) metadata[key.toLowerCase()] = value;
  });

  const links = $('a')
    .map((_, el) => {
      const href = $(el).attr('href') ?? '';
      const text = cleanText($(el).text());
      return { href, text, isInternal: isInternalLink(url, href) };
    })
    .get();

  const forms = $('form')
    .map((_, form) => {
      const fieldCount = $(form).find('input, textarea, select').length;
      const submitTexts = $(form)
        .find('button[type="submit"], input[type="submit"]')
        .map((__, btn) => cleanText($(btn).text() || $(btn).attr('value') || ''))
        .get();
      return { fieldCount, submitTexts };
    })
    .get();

  const schemas: Array<{ type: string; raw: unknown }> = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const rawJson = $(el).text();
    try {
      const parsed = JSON.parse(rawJson);
      const entries = Array.isArray(parsed) ? parsed : [parsed];
      entries.forEach((item) => {
        const type = item?.['@type'];
        if (typeof type === 'string') schemas.push({ type, raw: item });
      });
    } catch {
      // Ignore malformed schema blocks.
    }
  });

  const bodyText = cleanText($('body').text());

  return {
    url,
    html,
    text: bodyText,
    title: cleanText($('title').first().text()),
    description: metadata['description'],
    status,
    responseTimeMs,
    headings: $('h1, h2, h3, h4, h5, h6')
      .map((_, el) => cleanText($(el).text()))
      .get(),
    h1s: $('h1')
      .map((_, el) => cleanText($(el).text()))
      .get(),
    links,
    images: $('img')
      .map((_, img) => ({ src: $(img).attr('src'), alt: $(img).attr('alt') }))
      .get(),
    forms,
    buttons: $('button')
      .map((_, btn) => cleanText($(btn).text()))
      .get(),
    ctas: $('a, button')
      .map((_, el) => cleanText($(el).text()))
      .get()
      .filter(Boolean),
    navText: cleanText($('nav').text()),
    footerText: cleanText($('footer').text()),
    heroText: cleanText($('main section').first().text() || $('header').first().text()),
    hasViewport: Boolean($('meta[name="viewport"]').attr('content')),
    canonical: $('link[rel="canonical"]').attr('href') ?? undefined,
    metadata,
    schemas,
  };
};
