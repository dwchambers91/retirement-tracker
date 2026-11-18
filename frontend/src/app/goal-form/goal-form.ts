import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GoalData } from '../services/goal-data';

type GoalField = 'name' | 'targetAmount' | 'targetAge' | 'currentSavings' | 'monthlyContribution';

@Component({
  selector: 'app-goal-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './goal-form.html',
  styleUrl: './goal-form.scss',
})
export class GoalForm {
  private readonly fb = inject(FormBuilder);
  private readonly goalData = inject(GoalData);
  private readonly router = inject(Router);

  protected readonly submitted = signal(false);

  protected readonly form = this.fb.group({
    name: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(50)]),
    targetAmount: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
    targetAge: this.fb.control<number | null>(null, [Validators.required, Validators.min(18), Validators.max(100)]),
    currentSavings: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
    monthlyContribution: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
  });

  protected showError(field: GoalField): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  protected save(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    this.goalData.addGoal({
      name: value.name.trim(),
      targetAmount: value.targetAmount!,
      targetAge: value.targetAge!,
      currentSavings: value.currentSavings!,
      monthlyContribution: value.monthlyContribution!,
    });
    this.router.navigate(['/']);
  }
}
