import { Injectable, signal } from '@angular/core';
import { Goal } from '../models/goal.model';

@Injectable({ providedIn: 'root' })
export class GoalData {
  private readonly goalsSignal = signal<Goal[]>([
    { id: 1, name: 'Retire at 60', targetAmount: 1_200_000, targetAge: 60, currentSavings: 85_000, monthlyContribution: 1_500 },
    { id: 2, name: 'Early retirement', targetAmount: 1_500_000, targetAge: 55, currentSavings: 85_000, monthlyContribution: 2_000 },
  ]);

  readonly goals = this.goalsSignal.asReadonly();
}
