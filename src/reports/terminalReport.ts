import pc from 'picocolors';
import type { ScanResult } from '../engine/ruleTypes.js';

export function printTerminalReport(result: ScanResult, outputPath?: string): void {
  console.log(pc.bold(`\nConversionLint Score: ${result.score}/100\n`));
  console.log(pc.bold('Category Scores:'));
  Object.entries(result.categoryScores).forEach(([category, score]) => {
    console.log(`- ${category}: ${score.score}/${score.max}`);
  });

  const printBucket = (label: string, items: string[], color: (input: string) => string) => {
    console.log(`\n${pc.bold(label)}:`);
    if (items.length === 0) {
      console.log(color('✓ None detected'));
      return;
    }
    items.forEach((item) => console.log(color(item)));
  };

  printBucket(
    'Strong',
    result.summary.strong.slice(0, 8).map((r) => `✓ ${r.message}`),
    pc.green,
  );

  printBucket(
    'High Priority Issues',
    result.summary.highPriority.slice(0, 8).map((r) => `✕ ${r.message}`),
    pc.red,
  );

  printBucket(
    'Warnings',
    result.summary.warnings.slice(0, 8).map((r) => `! ${r.message}`),
    pc.yellow,
  );

  console.log(`\n${pc.bold('Recommended Fixes')}:`);
  result.summary.recommendations.slice(0, 8).forEach((item) => console.log(`- ${item}`));

  if (outputPath) console.log(pc.cyan(`\nMarkdown report exported: ${outputPath}`));
  console.log('');
}
