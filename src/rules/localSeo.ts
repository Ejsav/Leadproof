import type { Rule } from '../engine/ruleTypes.js';
import { extractSchemaTypes } from '../utils/schema.js';
import { includesAny } from '../utils/text.js';

export const localSeoRules: Rule = ({ pages }) => {
  const page = pages[0];
  const schemaTypes = extractSchemaTypes(page.schemas);
  const text = pages.map((p) => p.text).join(' ');
  const serviceLinks = pages.flatMap((p) => p.links).filter((l) => /service/.test(l.href + l.text));

  return [
    {
      id: 'ls-localbusiness-schema',
      category: 'localSeo',
      status: schemaTypes.includes('localbusiness') ? 'pass' : 'warning',
      severity: 'high',
      message: schemaTypes.includes('localbusiness')
        ? 'LocalBusiness schema found.'
        : 'LocalBusiness schema not detected.',
      explanation: 'LocalBusiness schema helps search engines understand local entities.',
      recommendation: 'Add JSON-LD LocalBusiness schema with NAP details.',
      weight: 3,
    },
    {
      id: 'ls-service-schema',
      category: 'localSeo',
      status: schemaTypes.includes('service') ? 'pass' : 'warning',
      severity: 'medium',
      message: schemaTypes.includes('service') ? 'Service schema found.' : 'Service schema not detected.',
      explanation: 'Service schema clarifies offerings in search contexts.',
      recommendation: 'Add Service schema for main offerings.',
      weight: 2,
    },
    {
      id: 'ls-faq-schema',
      category: 'localSeo',
      status: schemaTypes.includes('faqpage') || !includesAny(text, ['faq', 'frequently asked'])
        ? 'pass'
        : 'warning',
      severity: 'low',
      message:
        schemaTypes.includes('faqpage') || !includesAny(text, ['faq', 'frequently asked'])
          ? 'FAQ schema state looks acceptable.'
          : 'FAQ language detected without FAQ schema.',
      explanation: 'FAQ schema can improve SERP visibility when FAQ content exists.',
      recommendation: 'Add FAQPage schema for structured FAQ content.',
      weight: 1,
    },
    {
      id: 'ls-title-location',
      category: 'localSeo',
      status: /(in\s+[a-z]+|near\s+[a-z]+)/.test(page.title ?? '') ? 'pass' : 'warning',
      severity: 'medium',
      message: /(in\s+[a-z]+|near\s+[a-z]+)/.test(page.title ?? '')
        ? 'Title appears to include service/location pattern.'
        : 'Title may be missing service + location intent.',
      explanation: 'Service + location title patterns can improve local relevance.',
      recommendation: 'Include main service and target location in title tag.',
      weight: 2,
    },
    {
      id: 'ls-meta-description',
      category: 'localSeo',
      status: Boolean(page.description) ? 'pass' : 'fail',
      severity: 'high',
      message: page.description ? 'Meta description exists.' : 'Meta description missing.',
      explanation: 'Description helps search snippet clarity and click intent.',
      recommendation: 'Add a concise, intent-driven meta description.',
      weight: 1,
    },
    {
      id: 'ls-city-region-language',
      category: 'localSeo',
      status: /(city|county|neighborhood|area|serving)/.test(text) ? 'pass' : 'warning',
      severity: 'medium',
      message: /(city|county|neighborhood|area|serving)/.test(text)
        ? 'Service area language detected.'
        : 'No clear city/region/service-area language detected.',
      explanation: 'Local relevance copy helps qualify geographic intent.',
      recommendation: 'Mention service areas, neighborhoods, or city coverage.',
      weight: 1,
    },
    {
      id: 'ls-service-area-link',
      category: 'localSeo',
      status: pages.flatMap((p) => p.links).some((l) => /service-area|locations|areas-we-serve/.test(l.href))
        ? 'pass'
        : 'warning',
      severity: 'low',
      message: pages.flatMap((p) => p.links).some((l) => /service-area|locations|areas-we-serve/.test(l.href))
        ? 'Service area page link detected.'
        : 'No dedicated service area page link detected.',
      explanation: 'Service area pages can improve local discovery and qualification.',
      recommendation: 'Add a service area or locations page and link it in nav/footer.',
      weight: 1,
    },
    {
      id: 'ls-service-internal-links',
      category: 'localSeo',
      status: serviceLinks.length >= 2 ? 'pass' : 'warning',
      severity: 'medium',
      message:
        serviceLinks.length >= 2
          ? 'Internal links to service pages detected.'
          : 'Limited internal links to service pages detected.',
      explanation: 'Service page internal linking supports discoverability.',
      recommendation: 'Add internal links to core service pages from homepage/navigation.',
      evidence: serviceLinks.map((s) => `${s.text} -> ${s.href}`),
      weight: 2,
    },
    {
      id: 'ls-nap-signals',
      category: 'localSeo',
      status: /\d{3}[-.)\s]?\d{3}[-.\s]?\d{4}/.test(text) && /[0-9]{2,5}\s+[a-z]/.test(text)
        ? 'pass'
        : 'warning',
      severity: 'medium',
      message:
        /\d{3}[-.)\s]?\d{3}[-.\s]?\d{4}/.test(text) && /[0-9]{2,5}\s+[a-z]/.test(text)
          ? 'Potential NAP signals detected (phone + address-like text).'
          : 'ConversionLint could not confirm NAP consistency signals.',
      explanation: 'Visible name-address-phone patterns can support local trust.',
      recommendation: 'Ensure consistent business name, address, and phone on key pages.',
      weight: 1,
    },
    {
      id: 'ls-local-trust-language',
      category: 'localSeo',
      status: includesAny(text, ['local', 'family owned', 'serving', 'in your area']) ? 'pass' : 'warning',
      severity: 'low',
      message: includesAny(text, ['local', 'family owned', 'serving', 'in your area'])
        ? 'Local trust language detected.'
        : 'Limited local trust language detected.',
      explanation: 'Local positioning can improve trust and conversion intent.',
      recommendation: 'Add local credibility language tied to service geography.',
      weight: 1,
    },
  ];
};
