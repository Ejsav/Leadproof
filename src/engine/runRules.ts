import type { RuleResult, ScanContext } from './ruleTypes.js';
import { aboveFoldRules } from '../rules/aboveFold.js';
import { leadFlowRules } from '../rules/leadFlow.js';
import { trustSignalsRules } from '../rules/trustSignals.js';
import { localSeoRules } from '../rules/localSeo.js';
import { metadataRules } from '../rules/metadata.js';
import { technicalBasicsRules } from '../rules/technicalBasics.js';
import { conversionConsistencyRules } from '../rules/conversionConsistency.js';

export const runRules = (context: ScanContext): RuleResult[] => {
  const allRuleSets = [
    aboveFoldRules,
    leadFlowRules,
    trustSignalsRules,
    localSeoRules,
    metadataRules,
    technicalBasicsRules,
    conversionConsistencyRules,
  ];

  return allRuleSets.flatMap((runSet) => runSet(context));
};
