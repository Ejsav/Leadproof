import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { extractPageData } from '../../src/scanner/extractPageData.js';

const html = fs.readFileSync('tests/fixtures/good-site.html', 'utf8');

describe('metadata and schema extraction', () => {
  it('extracts metadata values', () => {
    const page = extractPageData('https://example.com', html, 200, 100);
    expect(page.metadata['og:title']).toBeTruthy();
    expect(page.description).toContain('Book local plumbing service');
  });

  it('extracts schema blocks', () => {
    const page = extractPageData('https://example.com', html, 200, 100);
    expect(page.schemas.some((schema) => schema.type === 'LocalBusiness')).toBe(true);
  });
});
