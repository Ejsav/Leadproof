import type { ScanResult } from '../engine/ruleTypes.js';

export function createMarkdownReport(result: ScanResult): string {
  const lines: string[] = [];
  lines.push('# ConversionLint Report');
  lines.push('');
  lines.push(`URL: ${result.url}`);
  lines.push(`Date: ${result.scannedAt}`);
  lines.push(`Score: ${result.score}/100`);
  lines.push('');
  lines.push('## Category Scores');
  lines.push('');

  Object.entries(result.categoryScores).forEach(([category, value]) => {
    lines.push(`- **${category}**: ${value.score}/${value.max}`);
  });

  const addSection = (title: string, items: string[]) => {
    lines.push('');
    lines.push(`## ${title}`);
    lines.push('');
    if (items.length === 0) {
      lines.push('- None detected.');
    } else {
      items.forEach((item) => lines.push(`- ${item}`));
    }
  };

  addSection('Strong Signals', result.summary.strong.map((r) => `${r.message} (${r.id})`));
  addSection('High Priority Issues', result.summary.highPriority.map((r) => `${r.message} (${r.id})`));
  addSection('Warnings', result.summary.warnings.map((r) => `${r.message} (${r.id})`));
  addSection('Recommended Fixes', result.summary.recommendations);

  lines.push('');
  lines.push('## Raw Rule Results');
  lines.push('');
  result.results.forEach((rule) => {
    lines.push(`### ${rule.id}`);
    lines.push(`- Category: ${rule.category}`);
    lines.push(`- Status: ${rule.status}`);
    lines.push(`- Severity: ${rule.severity}`);
    lines.push(`- Message: ${rule.message}`);
    lines.push(`- Explanation: ${rule.explanation}`);
    lines.push(`- Recommendation: ${rule.recommendation}`);
    if (rule.evidence?.length) lines.push(`- Evidence: ${rule.evidence.join('; ')}`);
    lines.push('');
  });

  return lines.join('\n');
}
