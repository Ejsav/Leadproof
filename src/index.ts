import type { ScanResult } from './engine/ruleTypes.js';
import { runRules } from './engine/runRules.js';
import { calculateScores } from './engine/score.js';
import { scanUrl } from './scanner/scanUrl.js';

export async function runConversionLint(url: string, maxPages = 1): Promise<ScanResult> {
  const data = await scanUrl(url, maxPages);
  const results = runRules(data);
  const { score, categoryScores } = calculateScores(results);

  const strong = results.filter((r) => r.status === 'pass');
  const highPriority = results.filter((r) => r.status !== 'pass' && (r.severity === 'high' || r.severity === 'critical'));
  const warnings = results.filter((r) => r.status === 'warning' && r.severity !== 'high' && r.severity !== 'critical');
  const recommendations = Array.from(new Set(results.filter((r) => r.status !== 'pass').map((r) => r.recommendation)));

  return {
    url: data.rootUrl,
    score,
    categoryScores,
    results,
    scannedAt: new Date().toISOString(),
    pagesScanned: data.pages.length,
    summary: {
      strong,
      highPriority,
      warnings,
      recommendations,
    },
  };
}
