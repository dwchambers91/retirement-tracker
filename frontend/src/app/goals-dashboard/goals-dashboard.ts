import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GoalData } from '../services/goal-data';
import { DEFAULT_ANNUAL_RETURN, projectGoal } from '../projection/projection';

@Component({
  selector: 'app-goals-dashboard',
  imports: [CurrencyPipe, PercentPipe, RouterLink],
  templateUrl: './goals-dashboard.html',
  styleUrl: './goals-dashboard.scss',
})
export class GoalsDashboard {
  private readonly goalData = inject(GoalData);

  protected readonly assumedReturn = DEFAULT_ANNUAL_RETURN;
  protected readonly goalViews = computed(() =>
    this.goalData.goals().map((goal) => ({ goal, projection: projectGoal(goal) })),
  );
}
