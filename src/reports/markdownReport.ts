import type { ScanResult } from '../engine/ruleTypes.js';

export const createMarkdownReport = (result: ScanResult): string => {
  const categoryLines = Object.entries(result.categoryScores)
    .map(([category, score]) => `- **${category}**: ${score}`)
    .join('\n');

  const list = (items: string[]) => (items.length ? items.map((item) => `- ${item}`).join('\n') : '- None detected');

  return `# ConversionLint Report

URL: ${result.url}
Date: ${result.scannedAt}
Score: ${result.score}/100
Pages Scanned: ${result.pagesScanned}

## Category Scores
${categoryLines}

## Strong Signals
${list(result.summary.strong.map((r) => `✅ ${r.message}`))}

## High Priority Issues
${list(result.summary.highPriorityIssues.map((r) => `❌ ${r.message}`))}

## Warnings
${list(result.summary.warnings.map((r) => `⚠️ ${r.message}`))}

## Recommended Fixes
${list(result.summary.recommendations)}

## Raw Rule Results
${result.results
  .map(
    (r) =>
      `### ${r.id}\n- Category: ${r.category}\n- Status: ${r.status}\n- Severity: ${r.severity}\n- Message: ${r.message}\n- Explanation: ${r.explanation}\n- Recommendation: ${r.recommendation}\n- Evidence: ${(r.evidence ?? []).join('; ') || 'n/a'}`,
  )
  .join('\n\n')}
`;
};
