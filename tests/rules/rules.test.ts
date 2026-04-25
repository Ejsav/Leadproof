import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { load } from 'cheerio';
import { extractPageData } from '../../src/scanner/extractPageData.js';
import { runRules } from '../../src/engine/runRules.js';
import { calculateScores } from '../../src/engine/score.js';
import { createMarkdownReport } from '../../src/reports/markdownReport.js';

function makeData(htmlPath: string) {
  const html = readFileSync(htmlPath, 'utf8');
  const page = extractPageData('https://example.com', {
    url: 'https://example.com',
    status: 200,
    html,
    loadMs: 1200,
  });
  return {
    rootUrl: 'https://example.com',
    pages: [page],
    allLinks: page.links.map((l) => l.href),
  };
}

describe('conversion rules', () => {
  it('detects CTA and weak CTA patterns', () => {
    const good = makeData('tests/fixtures/sample-good.html');
    const weak = makeData('tests/fixtures/sample-weak.html');
    const goodResults = runRules(good);
    const weakResults = runRules(weak);

    expect(goodResults.find((r) => r.id === 'abovefold-primary-cta')?.status).toBe('pass');
    expect(weakResults.find((r) => r.id === 'abovefold-weak-cta-language')?.status).toBe('warning');
  });

  it('extracts metadata and schema types', () => {
    const good = makeData('tests/fixtures/sample-good.html');
    const page = good.pages[0];

    expect(page.title).toContain('HVAC Repair');
    expect(page.metaDescription).toContain('Fast local HVAC');
    expect(page.schemaTypes).toContain('LocalBusiness');
  });

  it('calculates score in 0-100 range', () => {
    const results = runRules(makeData('tests/fixtures/sample-good.html'));
    const score = calculateScores(results);
    expect(score.score).toBeGreaterThanOrEqual(0);
    expect(score.score).toBeLessThanOrEqual(100);
  });

  it('generates markdown report with expected sections', () => {
    const results = runRules(makeData('tests/fixtures/sample-good.html'));
    const score = calculateScores(results);
    const report = createMarkdownReport({
      url: 'https://example.com',
      score: score.score,
      categoryScores: score.categoryScores,
      results,
      scannedAt: '2026-01-01T00:00:00.000Z',
      pagesScanned: 1,
      summary: {
        strong: results.filter((r) => r.status === 'pass'),
        highPriority: results.filter((r) => r.severity === 'high' || r.severity === 'critical'),
        warnings: results.filter((r) => r.status === 'warning'),
        recommendations: results.filter((r) => r.status !== 'pass').map((r) => r.recommendation),
      },
    });

    expect(report).toContain('# ConversionLint Report');
    expect(report).toContain('## Category Scores');
    expect(report).toContain('## Raw Rule Results');
  });

  it('detects local SEO and lead flow rules', () => {
    const results = runRules(makeData('tests/fixtures/sample-good.html'));
    expect(results.find((r) => r.id === 'localseo-localbusiness-schema')?.status).toBe('pass');
    expect(results.find((r) => r.id === 'leadflow-phone-link')?.status).toBe('pass');
  });

  it('fixture sanity check', () => {
    const html = readFileSync('tests/fixtures/sample-good.html', 'utf8');
    const $ = load(html);
    expect($('a').length).toBeGreaterThan(1);
  });
});
