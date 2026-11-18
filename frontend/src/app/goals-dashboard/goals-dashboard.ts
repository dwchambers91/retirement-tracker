import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { GoalData } from '../services/goal-data';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-goals-dashboard',
  imports: [CurrencyPipe,RouterLink],
  templateUrl: './goals-dashboard.html',
  styleUrl: './goals-dashboard.scss',
})
export class GoalsDashboard {
  private readonly goalData = inject(GoalData);
  protected readonly goals = this.goalData.goals;
}
