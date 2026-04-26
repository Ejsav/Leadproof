import { chromium } from 'playwright';

export type RenderResult = {
  ctasAboveFold: string[];
  mobileHasActionPath: boolean;
};

export const renderPage = async (url: string): Promise<RenderResult | undefined> => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

    const ctasAboveFold = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll('a, button'));
      return nodes
        .filter((el) => {
          const rect = el.getBoundingClientRect();
          return rect.top < 720 && (el.textContent ?? '').trim().length > 0;
        })
        .map((el) => (el.textContent ?? '').trim().toLowerCase())
        .slice(0, 12);
    });

    await page.setViewportSize({ width: 390, height: 844 });
    const mobileHasActionPath = await page.evaluate(() => {
      const actionWords = ['quote', 'contact', 'book', 'call', 'pricing', 'start'];
      return Array.from(document.querySelectorAll('a, button')).some((el) => {
        const text = (el.textContent ?? '').toLowerCase();
        return actionWords.some((word) => text.includes(word));
      });
    });

    return { ctasAboveFold, mobileHasActionPath };
  } catch {
    return undefined;
  } finally {
    await browser?.close();
  }
};
