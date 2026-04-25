import type { RuleDefinition } from '../engine/ruleTypes.js';
import { includesAny } from '../utils/text.js';

const category = 'Lead Flow';

export const leadFlowRules: RuleDefinition[] = [
  {
    id: 'leadflow-form-exists',
    category,
    run: ({ pages }) => {
      const has = pages.some((p) => p.forms.length > 0);
      return {
        id: 'leadflow-form-exists',
        category,
        status: has ? 'pass' : 'warning',
        severity: has ? 'low' : 'medium',
        message: has ? 'Contact form detected.' : 'Potential issue detected: no contact form found.',
        explanation: 'Form capture supports non-call leads.',
        recommendation: 'Add a short contact or quote form.',
        weight: 1,
      };
    },
  },
  {
    id: 'leadflow-phone-link',
    category,
    run: ({ pages }) => {
      const tel = pages.flatMap((p) => p.links).find((l) => l.isTel);
      return {
        id: 'leadflow-phone-link',
        category,
        status: tel ? 'pass' : 'fail',
        severity: tel ? 'low' : 'high',
        message: tel ? 'Phone CTA detected.' : 'Potential issue detected: no tel: phone link found.',
        explanation: 'Mobile-ready phone CTAs shorten the action path.',
        recommendation: 'Add at least one clickable tel: link in header or footer.',
        evidence: tel ? [tel.href] : undefined,
        weight: 1,
      };
    },
  },
  {
    id: 'leadflow-contact-path',
    category,
    run: ({ pages }) => {
      const contactLink = pages.flatMap((p) => p.links).find((l) => /contact|quote|estimate/i.test(l.href) || /contact|quote|estimate/i.test(l.text));
      return {
        id: 'leadflow-contact-path',
        category,
        status: contactLink ? 'pass' : 'fail',
        severity: contactLink ? 'low' : 'high',
        message: contactLink ? 'Contact/quote path detected.' : 'Potential issue detected: no clear contact path.',
        explanation: 'Visitors need obvious routes to request service or pricing.',
        recommendation: 'Add prominent Contact or Request Quote links in navigation and footer.',
        evidence: contactLink ? [`${contactLink.text} -> ${contactLink.href}`] : undefined,
        weight: 1,
      };
    },
  },
  {
    id: 'leadflow-form-complexity',
    category,
    run: ({ pages }) => {
      const largest = Math.max(0, ...pages.flatMap((p) => p.forms.map((f) => f.fieldCount)));
      return {
        id: 'leadflow-form-complexity',
        category,
        status: largest === 0 || largest <= 8 ? 'pass' : 'warning',
        severity: largest <= 8 ? 'low' : 'medium',
        message: largest <= 8 ? 'Form field count is conversion-friendly.' : 'Potential issue detected: form may be too long.',
        explanation: 'Long forms can reduce completion rates.',
        recommendation: 'Keep lead forms focused to essential fields only.',
        evidence: largest > 0 ? [`maxFields=${largest}`] : undefined,
        weight: 1,
      };
    },
  },
  {
    id: 'leadflow-submit-specificity',
    category,
    run: ({ pages }) => {
      const submit = pages.flatMap((p) => p.forms.map((f) => f.submitText ?? '')).find(Boolean);
      const weak = submit ? includesAny(submit, ['submit', 'send', 'continue']) : false;
      return {
        id: 'leadflow-submit-specificity',
        category,
        status: submit && !weak ? 'pass' : 'warning',
        severity: submit && !weak ? 'low' : 'medium',
        message: submit && !weak ? 'Form submit language appears specific.' : 'Potential issue detected: generic submit language.',
        explanation: 'Outcome-oriented submit labels reinforce value.',
        recommendation: 'Use labels like "Get My Quote" or "Schedule Consultation".',
        evidence: submit ? [submit] : ['No submit text detected'],
        weight: 1,
      };
    },
  },
];
