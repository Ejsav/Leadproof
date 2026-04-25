import type { ScanData } from '../engine/ruleTypes.js';
import { fetchPage } from './fetchPage.js';
import { renderPage } from './renderPage.js';
import { extractPageData } from './extractPageData.js';
import { crawlLinks } from './crawlLinks.js';

export async function scanUrl(url: string, maxPages = 1): Promise<ScanData> {
  const root = await fetchPage(url);
  const rendered = await renderPage(root.url);
  const rootData = extractPageData(url, root, rendered);

  const linksToScan = maxPages > 1 ? crawlLinks(url, root.html, maxPages) : [];
  const scannedPages = [rootData];

  for (const link of linksToScan) {
    try {
      const page = await fetchPage(link);
      scannedPages.push(extractPageData(url, page));
    } catch {
      // Keep scan resilient.
    }
  }

  return {
    rootUrl: rootData.url,
    pages: scannedPages,
    allLinks: scannedPages.flatMap((page) => page.links.map((link) => link.href)),
  };
}
