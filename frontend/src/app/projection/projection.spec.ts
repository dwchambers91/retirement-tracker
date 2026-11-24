import { projectGoal } from './projection';
import { Goal } from '../models/goal.model';

function goal(overrides: Partial<Goal>): Goal {
  return {
    id: 1,
    name: 'Test',
    currentAge: 60,
    targetAge: 61,
    targetAmount: 16_000,
    currentSavings: 10_000,
    monthlyContribution: 500,
    ...overrides,
  };
}

describe('projectGoal', () => {
  describe('with no investment return', () => {
    it('adds savings and contributions', () => {
      const result = projectGoal(goal({}), 0);

      expect(result.projectedBalance).toBe(16_000);
    });

    it('is on track when the projection exactly meets the target', () => {
      expect(projectGoal(goal({}), 0).onTrack).toBe(true);
    });

    it('is behind, and shows the extra needed, when short of the target', () => {
      const result = projectGoal(goal({ targetAmount: 20_000 }), 0);

      expect(result.onTrack).toBe(false);
      expect(result.requiredMonthlyContribution).toBeCloseTo(833.33, 2);
      expect(result.extraMonthlyNeeded).toBeCloseTo(333.33, 2);
    });
  });

  describe('with an investment return', () => {
    it('grows existing savings with monthly compounding', () => {
      const result = projectGoal(goal({ currentSavings: 1_000, monthlyContribution: 0 }), 0.12);

      expect(result.projectedBalance).toBeCloseTo(1_126.83, 2);
    });

    it('grows monthly contributions with monthly compounding', () => {
      const result = projectGoal(goal({ currentSavings: 0, monthlyContribution: 100 }), 0.12);

      expect(result.projectedBalance).toBeCloseTo(1_268.25, 2);
    });

    it('needs no extra contribution when savings alone exceed the target', () => {
      const result = projectGoal(goal({ currentSavings: 50_000, targetAmount: 20_000 }), 0.05);

      expect(result.onTrack).toBe(true);
      expect(result.requiredMonthlyContribution).toBe(0);
      expect(result.extraMonthlyNeeded).toBe(0);
    });
  });

  describe('with no time left', () => {
    it('projects current savings and cannot suggest a monthly amount', () => {
      const result = projectGoal(goal({ currentAge: 61, targetAge: 61 }), 0.05);

      expect(result.projectedBalance).toBe(10_000);
      expect(result.onTrack).toBe(false);
      expect(result.requiredMonthlyContribution).toBeNull();
      expect(result.extraMonthlyNeeded).toBeNull();
    });
  });
});
