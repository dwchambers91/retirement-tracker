import { Routes } from '@angular/router';
import { GoalsDashboard } from './goals-dashboard/goals-dashboard';
import { GoalForm } from './goal-form/goal-form';

export const routes: Routes = [
  { path: '', component: GoalsDashboard },
  { path: 'goals/new', component: GoalForm},
  { path: 'goals/:id/edit', component: GoalForm },

  //routs checked top to bottom, wild card must always be last
  { path: '**', redirectTo: '' },
];
