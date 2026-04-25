import { categoryWeights, severityPenalty } from './weights.js';
import type { CategoryScore, RuleResult } from './ruleTypes.js';

export function calculateScores(results: RuleResult[]): {
  score: number;
  categoryScores: Record<string, CategoryScore>;
} {
  const grouped = new Map<string, RuleResult[]>();
  for (const result of results) {
    const current = grouped.get(result.category) ?? [];
    current.push(result);
    grouped.set(result.category, current);
  }

  const categoryScores: Record<string, CategoryScore> = {};
  let total = 0;

  for (const [category, max] of Object.entries(categoryWeights)) {
    const entries = grouped.get(category) ?? [];
    if (entries.length === 0) {
      categoryScores[category] = { score: 0, max };
      continue;
    }

    const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
    let penaltyWeight = 0;
    for (const entry of entries) {
      if (entry.status === 'pass') continue;
      penaltyWeight += entry.weight * severityPenalty[entry.severity];
      if (entry.status === 'fail') penaltyWeight += entry.weight * 0.3;
    }

    const deductionRatio = Math.min(1, penaltyWeight / totalWeight);
    const categoryScore = Math.round(max * (1 - deductionRatio));
    categoryScores[category] = { score: categoryScore, max };
    total += categoryScore;
  }

  return { score: Math.max(0, Math.min(100, total)), categoryScores };
}
