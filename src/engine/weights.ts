export const categoryWeights = {
  'Above-the-Fold Conversion': 25,
  'Lead Flow': 20,
  'Trust Signals': 20,
  'Local SEO': 15,
  Metadata: 10,
  'Technical Basics': 5,
  'Conversion Consistency': 5,
} as const;

export const severityPenalty = {
  low: 0.25,
  medium: 0.5,
  high: 0.8,
  critical: 1,
} as const;

export const config = {
  ctaKeywords: [
    'get a free quote',
    'book a call',
    'schedule service',
    'call now',
    'request pricing',
    'start your project',
    'get started',
    'view pricing',
    'contact',
    'quote',
    'book',
  ],
  weakCtaWords: ['submit', 'click here', 'learn more', 'more info', 'continue'],
  trustKeywords: [
    'review',
    'testimonial',
    'case study',
    'portfolio',
    'licensed',
    'insured',
    'guarantee',
    'certified',
    'trusted by',
    'years of experience',
  ],
  localSeoKeywords: [
    'serving',
    'service area',
    'near me',
    'city',
    'county',
    'local',
    'in ',
  ],
  schemaTypes: ['LocalBusiness', 'Service', 'FAQPage'],
};
