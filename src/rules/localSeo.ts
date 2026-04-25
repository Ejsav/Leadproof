import type { RuleDefinition } from '../engine/ruleTypes.js';
import { includesAny } from '../utils/text.js';
import { config } from '../engine/weights.js';

const category = 'Local SEO';

export const localSeoRules: RuleDefinition[] = [
  {
    id: 'localseo-localbusiness-schema',
    category,
    run: ({ pages }) => {
      const has = pages.some((p) => p.schemaTypes.includes('LocalBusiness'));
      return {
        id: 'localseo-localbusiness-schema',
        category,
        status: has ? 'pass' : 'warning',
        severity: has ? 'low' : 'high',
        message: has ? 'LocalBusiness schema found.' : 'Potential issue detected: LocalBusiness schema missing.',
        explanation: 'Structured local business data helps search engines understand local relevance.',
        recommendation: 'Add JSON-LD LocalBusiness schema with NAP data.',
        evidence: pages.flatMap((p) => p.schemaTypes),
        weight: 1,
      };
    },
  },
  {
    id: 'localseo-service-faq-schema',
    category,
    run: ({ pages }) => {
      const hasService = pages.some((p) => p.schemaTypes.includes('Service'));
      const hasFaq = pages.some((p) => p.schemaTypes.includes('FAQPage'));
      return {
        id: 'localseo-service-faq-schema',
        category,
        status: hasService || hasFaq ? 'pass' : 'warning',
        severity: hasService || hasFaq ? 'low' : 'medium',
        message: hasService || hasFaq ? 'Service/FAQ schema detected.' : 'ConversionLint could not detect Service or FAQ schema.',
        explanation: 'Service and FAQ schema can support richer SERP understanding.',
        recommendation: 'Add Service and/or FAQPage schema where relevant.',
        evidence: pages.flatMap((p) => p.schemaTypes),
        weight: 1,
      };
    },
  },
  {
    id: 'localseo-title-location-service',
    category,
    run: ({ pages }) => {
      const title = pages[0].title ?? '';
      const hasServiceToken = /(service|repair|install|plumbing|hvac|electric|design|marketing|consult)/i.test(title);
      const hasLocationToken = /\b[A-Z][a-z]+\b/.test(title) || /near me|city|county/i.test(title);
      const pass = hasServiceToken && hasLocationToken;
      return {
        id: 'localseo-title-location-service',
        category,
        status: pass ? 'pass' : 'warning',
        severity: pass ? 'low' : 'medium',
        message: pass ? 'Title suggests service + location intent.' : 'Potential issue detected: title may lack service/location clarity.',
        explanation: 'Local intent often requires both service and place cues.',
        recommendation: 'Consider adding clear service and location wording in title tag.',
        evidence: title ? [title] : undefined,
        weight: 1,
      };
    },
  },
  {
    id: 'localseo-local-language-and-paths',
    category,
    run: ({ pages }) => {
      const bodyHas = includesAny(pages[0].bodyText, config.localSeoKeywords);
      const linksHas = pages.flatMap((p) => p.links).some((l) => /service-area|areas-we-serve|locations|services/i.test(l.href + l.text));
      const pass = bodyHas || linksHas;
      return {
        id: 'localseo-local-language-and-paths',
        category,
        status: pass ? 'pass' : 'warning',
        severity: pass ? 'low' : 'medium',
        message: pass ? 'Local service area language or links detected.' : 'ConversionLint could not detect strong local service area signals.',
        explanation: 'Service area cues can support local conversion context.',
        recommendation: 'Add explicit service area language and dedicated location/service-area links.',
        weight: 1,
      };
    },
  },
];
