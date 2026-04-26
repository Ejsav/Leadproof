import { describe, expect, it } from 'vitest';
import { computeCategoryScores, computeTotalScore } from '../../src/engine/score.js';
import type { RuleResult } from '../../src/engine/ruleTypes.js';

describe('score calculation', () => {
  it('reduces score on high-severity failures', () => {
    const results: RuleResult[] = [
      {
        id: 'a',
        category: 'aboveFold',
        status: 'fail',
        severity: 'critical',
        message: '',
        explanation: '',
        recommendation: '',
        weight: 3,
      },
    ];

    const categoryScores = computeCategoryScores(results);
    const total = computeTotalScore(categoryScores);
    expect(total).toBeLessThan(100);
  });
});
