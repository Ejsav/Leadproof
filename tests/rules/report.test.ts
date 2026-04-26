import { describe, expect, it } from 'vitest';
import { createMarkdownReport } from '../../src/reports/markdownReport.js';
import type { ScanResult } from '../../src/engine/ruleTypes.js';

describe('markdown report generation', () => {
  it('renders required sections', () => {
    const mock: ScanResult = {
      url: 'https://example.com',
      scannedAt: '2026-01-01T00:00:00.000Z',
      pagesScanned: 1,
      score: 80,
      categoryScores: {
        aboveFold: 20,
        leadFlow: 16,
        trustSignals: 14,
        localSeo: 12,
        metadata: 8,
        technicalBasics: 5,
        conversionConsistency: 5,
      },
      results: [],
      summary: { strong: [], highPriorityIssues: [], warnings: [], recommendations: [] },
    };

    const markdown = createMarkdownReport(mock);
    expect(markdown).toContain('# ConversionLint Report');
    expect(markdown).toContain('## Category Scores');
    expect(markdown).toContain('## Raw Rule Results');
  });
});
