import { isInternalLink, toAbsoluteUrl } from '../utils/links.js';

export const crawlLinks = (
  baseUrl: string,
  links: Array<{ href: string; isInternal: boolean }>,
  maxPages: number,
): string[] => {
  const unique = new Set<string>([baseUrl]);

  for (const link of links) {
    if (unique.size >= maxPages) break;
    if (!link.href || !isInternalLink(baseUrl, link.href) || !link.isInternal) continue;
    try {
      unique.add(toAbsoluteUrl(baseUrl, link.href));
    } catch {
      // Skip malformed URLs.
    }
  }

  return [...unique].slice(0, maxPages);
};
