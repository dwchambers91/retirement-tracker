import { Goal } from '../models/goal.model';

export interface Projection {
  projectedBalance: number;
  onTrack: boolean;
  requiredMonthlyContribution: number | null;
  extraMonthlyNeeded: number | null;
}

export const DEFAULT_ANNUAL_RETURN = 0.05;

export function projectGoal(goal: Goal, annualReturnRate: number = DEFAULT_ANNUAL_RETURN): Projection {

  // Whole years only. A goals ages are whole numbers, so partial years aren't modeled.
  const months = (goal.targetAge - goal.currentAge) * 12;

  if (months <= 0) {
    return {
      projectedBalance: goal.currentSavings,
      onTrack: goal.currentSavings >= goal.targetAmount,
      requiredMonthlyContribution: null,
      extraMonthlyNeeded: null,
    };
  }

  const monthlyRate = annualReturnRate / 12;
  const savingsGrowth = monthlyRate === 0 ? 1 : Math.pow(1 + monthlyRate, months);
  const contributionGrowth = monthlyRate === 0 ? months : (savingsGrowth - 1) / monthlyRate;

  const projectedBalance = goal.currentSavings * savingsGrowth + goal.monthlyContribution * contributionGrowth;
  const shortfall = goal.targetAmount - goal.currentSavings * savingsGrowth;
  const requiredMonthlyContribution = Math.max(0, shortfall / contributionGrowth);

  return {
    projectedBalance,
    onTrack: projectedBalance >= goal.targetAmount,
    requiredMonthlyContribution,
    extraMonthlyNeeded: Math.max(0, requiredMonthlyContribution - goal.monthlyContribution),
  };
}
