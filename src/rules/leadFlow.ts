import type { Rule } from '../engine/ruleTypes.js';
import { includesAny } from '../utils/text.js';

export const leadFlowRules: Rule = ({ pages }) => {
  const page = pages[0];
  const allText = pages.map((p) => p.text).join(' ');
  const allLinks = pages.flatMap((p) => p.links);
  const formCount = page.forms.length;
  const hasPhoneLink = allLinks.some((link) => link.href.startsWith('tel:'));
  const hasContactPath = allLinks.some((link) => /contact|quote|estimate/.test(link.href + link.text));
  const navOrFooterContact = /contact|quote|estimate/.test(`${page.navText} ${page.footerText}`);
  const fieldCount = page.forms[0]?.fieldCount ?? 0;
  const submitLabels = page.forms.flatMap((f) => f.submitTexts);

  return [
    {
      id: 'lf-contact-form',
      category: 'leadFlow',
      status: formCount > 0 ? 'pass' : 'warning',
      severity: 'high',
      message: formCount > 0 ? 'Contact form detected.' : 'No contact form detected on scanned pages.',
      explanation: 'Form capture supports users not ready to call immediately.',
      recommendation: 'Add a short contact/quote form with clear intent.',
      evidence: [`forms=${formCount}`],
      weight: 3,
    },
    {
      id: 'lf-phone-link',
      category: 'leadFlow',
      status: hasPhoneLink ? 'pass' : 'fail',
      severity: 'critical',
      message: hasPhoneLink ? 'Phone CTA (tel:) detected.' : 'No clickable phone link detected.',
      explanation: 'Click-to-call is a core conversion path for local and service sites.',
      recommendation: 'Add a visible tel: link in header and footer.',
      evidence: allLinks.filter((l) => l.href.startsWith('tel:')).map((l) => l.href),
      weight: 3,
    },
    {
      id: 'lf-quote-cta',
      category: 'leadFlow',
      status: includesAny(allText, ['quote', 'estimate', 'book', 'schedule']) ? 'pass' : 'warning',
      severity: 'high',
      message: includesAny(allText, ['quote', 'estimate', 'book', 'schedule'])
        ? 'Quote/contact CTA language detected.'
        : 'Potential issue detected: quote/contact CTA language is limited.',
      explanation: 'Visitors should quickly find the primary action path.',
      recommendation: 'Add explicit “Request Quote” or “Book Service” CTA language.',
      weight: 2,
      evidence: [allText.slice(0, 200)],
    },
    {
      id: 'lf-contact-link',
      category: 'leadFlow',
      status: hasContactPath ? 'pass' : 'fail',
      severity: 'high',
      message: hasContactPath ? 'Contact path link detected.' : 'No contact/quote link path detected.',
      explanation: 'A direct action path reduces friction.',
      recommendation: 'Add /contact or /request-quote links in primary navigation.',
      evidence: allLinks.slice(0, 12).map((l) => `${l.text} -> ${l.href}`),
      weight: 2,
    },
    {
      id: 'lf-nav-footer-contact',
      category: 'leadFlow',
      status: navOrFooterContact ? 'pass' : 'warning',
      severity: 'medium',
      message: navOrFooterContact
        ? 'Contact path appears in navigation/footer.'
        : 'No clear contact path in nav/footer detected.',
      explanation: 'Persistent access to contact paths supports conversion.',
      recommendation: 'Add Contact/Quote links to both nav and footer.',
      weight: 2,
      evidence: [page.navText.slice(0, 100), page.footerText.slice(0, 100)],
    },
    {
      id: 'lf-form-field-count',
      category: 'leadFlow',
      status: fieldCount === 0 || fieldCount <= 8 ? 'pass' : 'warning',
      severity: 'medium',
      message:
        fieldCount <= 8
          ? 'Form length appears conversion-friendly.'
          : 'Form appears long and may increase abandonment.',
      explanation: 'Excessive fields can reduce submissions.',
      recommendation: 'Keep initial lead form to 5–8 essential fields.',
      weight: 2,
      evidence: [`fieldCount=${fieldCount}`],
    },
    {
      id: 'lf-submit-specific',
      category: 'leadFlow',
      status: submitLabels.some((t) => /quote|book|call|schedule|request|start/.test(t))
        ? 'pass'
        : submitLabels.length > 0
          ? 'warning'
          : 'warning',
      severity: 'medium',
      message: submitLabels.some((t) => /quote|book|call|schedule|request|start/.test(t))
        ? 'Submit button text is specific.'
        : 'Form submit wording appears generic.',
      explanation: 'Specific button text reinforces user intent.',
      recommendation: 'Use submit labels like “Request My Quote”.',
      evidence: submitLabels,
      weight: 2,
    },
    {
      id: 'lf-pricing-to-contact',
      category: 'leadFlow',
      status: pages.some(
        (p) => /pricing|services/.test(p.url) && /contact|quote|estimate/.test(p.text),
      )
        ? 'pass'
        : 'warning',
      severity: 'medium',
      message: pages.some(
        (p) => /pricing|services/.test(p.url) && /contact|quote|estimate/.test(p.text),
      )
        ? 'Pricing/service pages appear to link back into lead flow.'
        : 'ConversionLint could not verify pricing/service links back to contact flow.',
      explanation: 'Decision pages should route users to conversion steps.',
      recommendation: 'Add quote/contact CTA modules on pricing and service pages.',
      weight: 2,
    },
    {
      id: 'lf-mobile-viewport',
      category: 'leadFlow',
      status: page.hasViewport ? 'pass' : 'fail',
      severity: 'high',
      message: page.hasViewport ? 'Mobile viewport tag exists.' : 'Viewport meta tag missing.',
      explanation: 'Mobile usability is critical for conversion.',
      recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.',
      weight: 1,
    },
    {
      id: 'lf-direct-action-path',
      category: 'leadFlow',
      status: hasPhoneLink || hasContactPath || formCount > 0 ? 'pass' : 'fail',
      severity: 'critical',
      message:
        hasPhoneLink || hasContactPath || formCount > 0
          ? 'At least one direct action path detected.'
          : 'No direct action path detected.',
      explanation: 'Sites intended to convert should always provide a direct next step.',
      recommendation: 'Provide at minimum one of: tel link, form, or contact path link.',
      weight: 3,
    },
  ];
};
