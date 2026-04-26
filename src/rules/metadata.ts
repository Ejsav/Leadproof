import type { Rule } from '../engine/ruleTypes.js';

export const metadataRules: Rule = ({ pages }) => {
  const page = pages[0];
  const meta = page.metadata;

  const hasNoIndex = Object.entries(meta).some(
    ([name, content]) => name.includes('robots') && /noindex/.test(content),
  );

  return [
    {
      id: 'md-title',
      category: 'metadata',
      status: Boolean(page.title) ? 'pass' : 'fail',
      severity: 'high',
      message: page.title ? 'Title tag exists.' : 'Title tag missing.',
      explanation: 'Title tags influence SERP visibility and click intent.',
      recommendation: 'Add a unique page title.',
      weight: 2,
    },
    {
      id: 'md-description',
      category: 'metadata',
      status: Boolean(page.description) ? 'pass' : 'fail',
      severity: 'high',
      message: page.description ? 'Meta description exists.' : 'Meta description missing.',
      explanation: 'Description contributes to search snippet clarity.',
      recommendation: 'Add a conversion-focused meta description.',
      weight: 2,
    },
    {
      id: 'md-og-title',
      category: 'metadata',
      status: Boolean(meta['og:title']) ? 'pass' : 'warning',
      severity: 'medium',
      message: meta['og:title'] ? 'Open Graph title found.' : 'Open Graph title missing.',
      explanation: 'OG metadata improves shared-link previews.',
      recommendation: 'Add og:title meta tag.',
      weight: 1,
    },
    {
      id: 'md-og-description',
      category: 'metadata',
      status: Boolean(meta['og:description']) ? 'pass' : 'warning',
      severity: 'medium',
      message: meta['og:description']
        ? 'Open Graph description found.'
        : 'Open Graph description missing.',
      explanation: 'OG description supports clearer social snippets.',
      recommendation: 'Add og:description meta tag.',
      weight: 1,
    },
    {
      id: 'md-og-image',
      category: 'metadata',
      status: Boolean(meta['og:image']) ? 'pass' : 'warning',
      severity: 'medium',
      message: meta['og:image'] ? 'Open Graph image found.' : 'Open Graph image missing.',
      explanation: 'OG image heavily affects preview click behavior.',
      recommendation: 'Add a branded og:image with appropriate dimensions.',
      weight: 1,
    },
    {
      id: 'md-twitter-card',
      category: 'metadata',
      status: Boolean(meta['twitter:card']) ? 'pass' : 'warning',
      severity: 'low',
      message: meta['twitter:card'] ? 'Twitter card metadata found.' : 'Twitter card metadata missing.',
      explanation: 'Twitter card metadata can improve shared post quality.',
      recommendation: 'Add twitter:card and supporting Twitter meta tags.',
      weight: 1,
    },
    {
      id: 'md-canonical',
      category: 'metadata',
      status: Boolean(page.canonical) ? 'pass' : 'warning',
      severity: 'low',
      message: page.canonical ? 'Canonical URL exists.' : 'Canonical URL missing.',
      explanation: 'Canonical tags help resolve duplicate URL variants.',
      recommendation: 'Add a canonical URL tag.',
      weight: 1,
    },
    {
      id: 'md-favicon',
      category: 'metadata',
      status: /rel=["'](shortcut )?icon["']/.test(page.html) ? 'pass' : 'warning',
      severity: 'low',
      message: /rel=["'](shortcut )?icon["']/.test(page.html)
        ? 'Favicon link found.'
        : 'Favicon not detected.',
      explanation: 'Basic brand cues can increase trust.',
      recommendation: 'Add rel="icon" metadata.',
      weight: 0.5,
    },
    {
      id: 'md-viewport',
      category: 'metadata',
      status: page.hasViewport ? 'pass' : 'fail',
      severity: 'high',
      message: page.hasViewport ? 'Viewport tag exists.' : 'Viewport tag missing.',
      explanation: 'Mobile-friendly rendering affects conversion flow.',
      recommendation: 'Add a viewport meta tag.',
      weight: 0.5,
    },
    {
      id: 'md-noindex',
      category: 'metadata',
      status: hasNoIndex ? 'warning' : 'pass',
      severity: 'high',
      message: hasNoIndex ? 'Potential noindex directive detected.' : 'No accidental noindex tag detected.',
      explanation: 'Noindex on key pages can hurt discovery and lead flow.',
      recommendation: 'Review robots directives for production pages.',
      weight: 1,
    },
  ];
};
