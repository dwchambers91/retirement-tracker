import { Injectable, signal } from '@angular/core';
import { Goal } from '../models/goal.model';

@Injectable({ providedIn: 'root' })
export class GoalData {
  private readonly goalsSignal = signal<Goal[]>([
    { id: 1, name: 'Retire at 60', currentAge: 35, targetAmount: 1_200_000, targetAge: 60, currentSavings: 85_000, monthlyContribution: 1_500 },
    { id: 2, name: 'Early retirement', currentAge: 35, targetAmount: 1_500_000, targetAge: 55, currentSavings: 85_000, monthlyContribution: 2_000 },
  ]);

  readonly goals = this.goalsSignal.asReadonly();

  addGoal(newGoal: Omit<Goal, 'id'>): Goal {
    const nextId = Math.max(0, ...this.goalsSignal().map((g) => g.id)) + 1;
    const goal: Goal = { ...newGoal, id: nextId };
    this.goalsSignal.update((goals) => [...goals, goal]);
    return goal;
  }
}
