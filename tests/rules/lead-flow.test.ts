import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { extractPageData } from '../../src/scanner/extractPageData.js';
import { leadFlowRules } from '../../src/rules/leadFlow.js';

const html = fs.readFileSync('tests/fixtures/good-site.html', 'utf8');

describe('lead flow rules', () => {
  it('finds direct action path', () => {
    const page = extractPageData('https://example.com', html, 200, 100);
    const results = leadFlowRules({ startUrl: page.url, pages: [page], maxPages: 1 });
    expect(results.find((r) => r.id === 'lf-direct-action-path')?.status).toBe('pass');
  });
});
