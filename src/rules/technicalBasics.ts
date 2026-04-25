import type { RuleDefinition } from '../engine/ruleTypes.js';

const category = 'Technical Basics';

export const technicalRules: RuleDefinition[] = [
  {
    id: 'tech-status-lang',
    category,
    run: ({ pages }) => {
      const statusOk = pages.every((p) => p.status >= 200 && p.status < 400);
      const hasLang = Boolean(pages[0].lang);
      return {
        id: 'tech-status-lang',
        category,
        status: statusOk && hasLang ? 'pass' : 'warning',
        severity: statusOk && hasLang ? 'low' : 'medium',
        message: statusOk && hasLang ? 'HTTP status and lang attribute look healthy.' : 'Potential issue detected: HTTP status or lang attribute issue.',
        explanation: 'Technical correctness impacts trust and usability.',
        recommendation: 'Resolve non-2xx/3xx status codes and set html lang attribute.',
        evidence: [`statusOk=${statusOk}`, `lang=${pages[0].lang ?? 'missing'}`],
        weight: 1,
      };
    },
  },
  {
    id: 'tech-heading-order-dup-h1',
    category,
    run: ({ pages }) => {
      const headings = pages[0].headings;
      let jump = false;
      for (let i = 1; i < headings.length; i++) {
        if (headings[i].level - headings[i - 1].level > 1) jump = true;
      }
      const dupH1 = pages[0].h1s.length > 1;
      const pass = !jump && !dupH1;
      return {
        id: 'tech-heading-order-dup-h1',
        category,
        status: pass ? 'pass' : 'warning',
        severity: pass ? 'low' : 'medium',
        message: pass ? 'Heading structure appears clean.' : 'Potential issue detected: heading order jump or duplicate H1.',
        explanation: 'Heading structure supports scanability and confidence.',
        recommendation: 'Use one H1 and sequential heading hierarchy.',
        evidence: [`h1Count=${pages[0].h1s.length}`, `jump=${jump}`],
        weight: 1,
      };
    },
  },
  {
    id: 'tech-empty-elements-alt',
    category,
    run: ({ pages }) => {
      const emptyLinks = pages[0].links.filter((l) => !l.text.trim()).length;
      const missingAlt = pages[0].images.filter((img) => !img.alt).length;
      const pass = emptyLinks === 0 && missingAlt <= 2;
      return {
        id: 'tech-empty-elements-alt',
        category,
        status: pass ? 'pass' : 'warning',
        severity: pass ? 'low' : 'medium',
        message: pass ? 'No major empty links/buttons or alt issues detected.' : 'Potential issue detected: empty links or missing alt text.',
        explanation: 'Missing labels and alt text reduce clarity and confidence.',
        recommendation: 'Add descriptive link text and alt text on important images.',
        evidence: [`emptyLinks=${emptyLinks}`, `missingAlt=${missingAlt}`],
        weight: 1,
      };
    },
  },
  {
    id: 'tech-performance-title-description-length',
    category,
    run: ({ pages }) => {
      const loadMs = pages[0].pageLoadMs ?? 0;
      const titleLength = pages[0].title?.length ?? 0;
      const descriptionLength = pages[0].metaDescription?.length ?? 0;
      const pass = loadMs <= 4000 && titleLength <= 70 && descriptionLength <= 170;
      return {
        id: 'tech-performance-title-description-length',
        category,
        status: pass ? 'pass' : 'warning',
        severity: pass ? 'low' : 'medium',
        message: pass ? 'Basic performance and snippet lengths look healthy.' : 'Potential issue detected: slow response or long metadata.',
        explanation: 'Slow loads and overlong snippets can hurt conversion context.',
        recommendation: 'Improve server response time and keep title/description concise.',
        evidence: [`loadMs=${loadMs}`, `titleLength=${titleLength}`, `descriptionLength=${descriptionLength}`],
        weight: 1,
      };
    },
  },
];
