import { fetchPage } from './fetchPage.js';
import { renderPage } from './renderPage.js';
import { extractPageData } from './extractPageData.js';
import { crawlLinks } from './crawlLinks.js';
import { runRules } from '../engine/runRules.js';
import { computeCategoryScores, computeTotalScore } from '../engine/score.js';
import type { ScanResult } from '../engine/ruleTypes.js';

export const scanUrl = async (url: string, maxPages: number): Promise<ScanResult> => {
  const firstFetch = await fetchPage(url);
  const firstPage = extractPageData(
    firstFetch.finalUrl,
    firstFetch.html,
    firstFetch.status,
    firstFetch.responseTimeMs,
  );
  firstPage.rendered = await renderPage(firstFetch.finalUrl);

  const crawlTargets = crawlLinks(firstFetch.finalUrl, firstPage.links, maxPages);
  const pages = [firstPage];

  for (const target of crawlTargets.slice(1)) {
    try {
      const fetched = await fetchPage(target);
      const page = extractPageData(
        fetched.finalUrl,
        fetched.html,
        fetched.status,
        fetched.responseTimeMs,
      );
      pages.push(page);
    } catch {
      // Continue scanning other pages.
    }
  }

  const results = runRules({ startUrl: firstFetch.finalUrl, pages, maxPages });
  const categoryScores = computeCategoryScores(results);
  const score = computeTotalScore(categoryScores);

  const strong = results.filter((r) => r.status === 'pass').slice(0, 10);
  const highPriorityIssues = results.filter(
    (r) => r.status === 'fail' && (r.severity === 'high' || r.severity === 'critical'),
  );
  const warnings = results.filter((r) => r.status === 'warning');
  const recommendations = [...new Set(results.filter((r) => r.status !== 'pass').map((r) => r.recommendation))];

  return {
    url: firstFetch.finalUrl,
    scannedAt: new Date().toISOString(),
    pagesScanned: pages.length,
    score,
    categoryScores,
    results,
    summary: { strong, highPriorityIssues, warnings, recommendations },
  };
};
