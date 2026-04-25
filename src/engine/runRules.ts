import type { RuleResult, ScanData } from './ruleTypes.js';
import { aboveFoldRules } from '../rules/aboveFold.js';
import { leadFlowRules } from '../rules/leadFlow.js';
import { trustSignalRules } from '../rules/trustSignals.js';
import { localSeoRules } from '../rules/localSeo.js';
import { metadataRules } from '../rules/metadata.js';
import { technicalRules } from '../rules/technicalBasics.js';
import { consistencyRules } from '../rules/conversionConsistency.js';

export function runRules(data: ScanData): RuleResult[] {
  const allRules = [
    ...aboveFoldRules,
    ...leadFlowRules,
    ...trustSignalRules,
    ...localSeoRules,
    ...metadataRules,
    ...technicalRules,
    ...consistencyRules,
  ];

  return allRules.map((rule) => {
    try {
      return rule.run(data);
    } catch (error) {
      return {
        id: rule.id,
        category: rule.category,
        status: 'warning' as const,
        severity: 'medium' as const,
        message: `Rule execution warning: ${rule.id}`,
        explanation: 'A rule failed during analysis. Scan continued safely.',
        recommendation: 'Retry scan and report issue if it persists.',
        evidence: [error instanceof Error ? error.message : 'Unknown rule error'],
        weight: 1,
      };
    }
  });
}
