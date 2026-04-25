import type { RuleDefinition } from '../engine/ruleTypes.js';

const category = 'Metadata';

export const metadataRules: RuleDefinition[] = [
  {
    id: 'meta-title',
    category,
    run: ({ pages }) => ({
      id: 'meta-title',
      category,
      status: pages[0].title ? 'pass' : 'fail',
      severity: pages[0].title ? 'low' : 'high',
      message: pages[0].title ? 'Title tag exists.' : 'Potential issue detected: title tag missing.',
      explanation: 'Title tags shape search snippets and first impressions.',
      recommendation: 'Add a descriptive title tag with service intent.',
      evidence: pages[0].title ? [pages[0].title] : undefined,
      weight: 1,
    }),
  },
  {
    id: 'meta-description',
    category,
    run: ({ pages }) => ({
      id: 'meta-description',
      category,
      status: pages[0].metaDescription ? 'pass' : 'warning',
      severity: pages[0].metaDescription ? 'low' : 'medium',
      message: pages[0].metaDescription ? 'Meta description exists.' : 'Potential issue detected: meta description missing.',
      explanation: 'Descriptions can improve SERP click-through quality.',
      recommendation: 'Add a concise description with value and next step.',
      evidence: pages[0].metaDescription ? [pages[0].metaDescription] : undefined,
      weight: 1,
    }),
  },
  {
    id: 'meta-open-graph',
    category,
    run: ({ pages }) => {
      const md = pages[0].metadata;
      const hasTitle = Boolean(md['og:title']);
      const hasDesc = Boolean(md['og:description']);
      const hasImage = Boolean(md['og:image']);
      const pass = hasTitle && hasDesc && hasImage;
      return {
        id: 'meta-open-graph',
        category,
        status: pass ? 'pass' : 'warning',
        severity: pass ? 'low' : 'medium',
        message: pass ? 'Open Graph metadata complete.' : 'Potential issue detected: Open Graph metadata incomplete.',
        explanation: 'OG metadata affects social link previews and trust.',
        recommendation: 'Add og:title, og:description, and og:image tags.',
        evidence: [
          `og:title=${hasTitle}`,
          `og:description=${hasDesc}`,
          `og:image=${hasImage}`,
        ],
        weight: 1,
      };
    },
  },
  {
    id: 'meta-twitter-canonical-indexing',
    category,
    run: ({ pages }) => {
      const md = pages[0].metadata;
      const hasTwitter = Boolean(md['twitter:card']);
      const hasCanonical = Boolean(pages[0].canonical);
      const noNoindex = !pages[0].hasNoIndex;
      const pass = hasTwitter && hasCanonical && noNoindex;
      return {
        id: 'meta-twitter-canonical-indexing',
        category,
        status: pass ? 'pass' : 'warning',
        severity: pass ? 'low' : 'high',
        message: pass ? 'Twitter card, canonical, and indexing signals look healthy.' : 'Potential issue detected: missing Twitter/canonical or accidental noindex.',
        explanation: 'Metadata consistency supports discovery and sharing.',
        recommendation: 'Ensure twitter:card, canonical URL, and indexable robots settings.',
        evidence: [`twitter:card=${hasTwitter}`, `canonical=${hasCanonical}`, `noindex=${!noNoindex}`],
        weight: 1,
      };
    },
  },
];
