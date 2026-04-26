import pc from 'picocolors';
import type { ScanResult } from '../engine/ruleTypes.js';

export const renderTerminalReport = (result: ScanResult, outputPath?: string): string => {
  const scoreColor =
    result.score >= 80 ? pc.green : result.score >= 60 ? pc.yellow : pc.red;

  const categoryScores = Object.entries(result.categoryScores)
    .map(([category, score]) => `  - ${category}: ${score}`)
    .join('\n');

  const strong = result.summary.strong
    .slice(0, 5)
    .map((rule) => `✓ ${rule.message}`)
    .join('\n');

  const highIssues = result.summary.highPriorityIssues
    .slice(0, 5)
    .map((rule) => `✕ ${rule.message}`)
    .join('\n');

  const warnings = result.summary.warnings
    .slice(0, 5)
    .map((rule) => `! ${rule.message}`)
    .join('\n');

  return [
    `ConversionLint Score: ${scoreColor(`${result.score}/100`)}`,
    '',
    'Category Scores:',
    categoryScores,
    '',
    'Strong:',
    strong || '✓ None detected yet',
    '',
    'High Priority Issues:',
    highIssues || '✕ None detected',
    '',
    'Warnings:',
    warnings || '! None detected',
    '',
    'Recommended Fixes:',
    ...result.summary.recommendations.slice(0, 5).map((rec) => `- ${rec}`),
    outputPath ? `\nReport exported: ${outputPath}` : '',
  ]
    .filter(Boolean)
    .join('\n');
};
