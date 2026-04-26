import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { extractPageData } from '../../src/scanner/extractPageData.js';
import { aboveFoldRules } from '../../src/rules/aboveFold.js';

const goodHtml = fs.readFileSync('tests/fixtures/good-site.html', 'utf8');
const weakHtml = fs.readFileSync('tests/fixtures/weak-cta.html', 'utf8');

describe('CTA detection', () => {
  it('detects strong CTA language', () => {
    const page = extractPageData('https://example.com', goodHtml, 200, 100);
    const results = aboveFoldRules({ startUrl: page.url, pages: [page], maxPages: 1 });
    expect(results.find((r) => r.id === 'af-primary-cta')?.status).toBe('pass');
  });

  it('flags weak CTA wording', () => {
    const page = extractPageData('https://example.com', weakHtml, 200, 100);
    const results = aboveFoldRules({ startUrl: page.url, pages: [page], maxPages: 1 });
    expect(results.find((r) => r.id === 'af-cta-specific')?.status).toBe('warning');
  });
});
