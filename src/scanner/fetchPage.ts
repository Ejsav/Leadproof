import type { ScanPage } from '../engine/ruleTypes.js';

export async function fetchPage(url: string): Promise<ScanPage> {
  const start = Date.now();
  const response = await fetch(url, {
    redirect: 'follow',
    headers: { 'user-agent': 'conversionlint/0.1.0 (+https://github.com/ericjokl/conversionlint)' },
  });

  const html = await response.text();

  return {
    url: response.url,
    status: response.status,
    html,
    loadMs: Date.now() - start,
  };
}
