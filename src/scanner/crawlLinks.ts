import { load } from 'cheerio';
import { absolutizeLink, isInternalLink } from '../utils/links.js';

export function crawlLinks(rootUrl: string, html: string, maxPages: number): string[] {
  const $ = load(html);
  const links = new Set<string>();

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') ?? '';
    if (!isInternalLink(rootUrl, href)) return;
    const absolute = absolutizeLink(rootUrl, href);
    if (absolute) links.add(absolute);
  });

  return Array.from(links).slice(0, Math.max(maxPages - 1, 0));
}
