import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { extractPageData } from '../../src/scanner/extractPageData.js';
import { localSeoRules } from '../../src/rules/localSeo.js';

const html = fs.readFileSync('tests/fixtures/good-site.html', 'utf8');

describe('local seo rules', () => {
  it('detects LocalBusiness schema', () => {
    const page = extractPageData('https://example.com', html, 200, 100);
    const results = localSeoRules({ startUrl: page.url, pages: [page], maxPages: 1 });
    expect(results.find((r) => r.id === 'ls-localbusiness-schema')?.status).toBe('pass');
  });
});
