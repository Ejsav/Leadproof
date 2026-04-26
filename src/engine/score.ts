import { CATEGORY_WEIGHTS, SEVERITY_MULTIPLIER } from './weights.js';
import type { RuleCategory, RuleResult } from './ruleTypes.js';

const statusPenaltyFactor = (status: RuleResult['status']): number => {
  if (status === 'pass') return 0;
  if (status === 'warning') return 0.5;
  return 1;
};

export const computeCategoryScores = (
  results: RuleResult[],
): Record<RuleCategory, number> => {
  const byCategory = Object.keys(CATEGORY_WEIGHTS).reduce(
    (acc, category) => {
      acc[category as RuleCategory] = results.filter(
        (r) => r.category === category,
      );
      return acc;
    },
    {} as Record<RuleCategory, RuleResult[]>,
  );

  return Object.entries(byCategory).reduce(
    (acc, [category, categoryResults]) => {
      const maxWeight = categoryResults.reduce((sum, r) => sum + r.weight, 0) || 1;
      const weightedPenalty = categoryResults.reduce((sum, rule) => {
        const factor = statusPenaltyFactor(rule.status);
        return sum + rule.weight * factor * SEVERITY_MULTIPLIER[rule.severity];
      }, 0);

      const normalizedPenalty = Math.min(weightedPenalty / maxWeight, 1);
      const categoryScore = Math.max(
        0,
        Math.round(CATEGORY_WEIGHTS[category as RuleCategory] * (1 - normalizedPenalty)),
      );
      acc[category as RuleCategory] = categoryScore;
      return acc;
    },
    {} as Record<RuleCategory, number>,
  );
};

export const computeTotalScore = (
  categoryScores: Record<RuleCategory, number>,
): number => Object.values(categoryScores).reduce((sum, value) => sum + value, 0);
