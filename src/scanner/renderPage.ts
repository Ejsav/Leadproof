import { chromium } from 'playwright';

export async function renderPage(url: string): Promise<{ html?: string; ctaPositions: Record<string, number>; error?: string }> {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(400);

    const html = await page.content();
    const ctaPositions = await page.evaluate(() => {
      const selectors = ['a', 'button', 'input[type="submit"]'];
      const out: Record<string, number> = {};
      document.querySelectorAll(selectors.join(',')).forEach((el) => {
        const text = (el.textContent || (el as HTMLInputElement).value || '').trim();
        if (!text) return;
        const rect = el.getBoundingClientRect();
        out[text.toLowerCase()] = rect.top;
      });
      return out;
    });

    return { html, ctaPositions };
  } catch (error) {
    return { ctaPositions: {}, error: error instanceof Error ? error.message : 'Unknown render error' };
  } finally {
    await browser?.close();
  }
}
