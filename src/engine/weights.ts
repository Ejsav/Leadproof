import type { RuleCategory } from './ruleTypes.js';

export const CATEGORY_WEIGHTS: Record<RuleCategory, number> = {
  aboveFold: 25,
  leadFlow: 20,
  trustSignals: 20,
  localSeo: 15,
  metadata: 10,
  technicalBasics: 5,
  conversionConsistency: 5,
};

export const SEVERITY_MULTIPLIER = {
  low: 0.5,
  medium: 1,
  high: 1.5,
  critical: 2,
} as const;

export const KEYWORDS = {
  ctaStrong: [
    'get a free quote',
    'book a call',
    'schedule service',
    'call now',
    'request pricing',
    'start your project',
    'get started',
    'view pricing',
    'contact us',
    'request estimate',
  ],
  ctaWeak: ['submit', 'click here', 'learn more', 'more info', 'continue'],
  trust: [
    'review',
    'testimonial',
    'case study',
    'portfolio',
    'licensed',
    'insured',
    'guarantee',
    'certified',
    'years of experience',
  ],
  localSeo: [
    'service area',
    'near me',
    'in ',
    'city',
    'county',
    'neighborhood',
    'local',
  ],
  weakWords: ['quality', 'best', 'professional', 'trusted', 'solutions'],
  schemaTypes: ['LocalBusiness', 'Service', 'FAQPage'],
};
