import { Component, inject, signal, OnInit, computed, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GoalData } from '../services/goal-data';

type GoalField = 'name' |'currentAge'| 'targetAmount' | 'targetAge' | 'currentSavings' | 'monthlyContribution';

function targetAgeAfterCurrentAge(group: AbstractControl): ValidationErrors | null {
  const currentAge = group.get('currentAge')?.value;
  const targetAge = group.get('targetAge')?.value;
  if (currentAge == null || targetAge == null) {
    return null;
  }
  return targetAge > currentAge ? null : { targetAgeNotAfterCurrentAge: true };
}

@Component({
  selector: 'app-goal-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './goal-form.html',
  styleUrl: './goal-form.scss',
})

export class GoalForm implements OnInit {
  readonly id = input<string>();
  protected readonly isEditing = computed(() => this.id() !== undefined);

  private readonly fb = inject(FormBuilder);
  private readonly goalData = inject(GoalData);
  private readonly router = inject(Router);

  protected readonly submitted = signal(false);

  protected readonly form = this.fb.group({
    name: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(50)]),
    currentAge: this.fb.control<number | null>(null, [Validators.required, Validators.min(18), Validators.max(99)]),
    targetAmount: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
    targetAge: this.fb.control<number | null>(null, [Validators.required, Validators.min(18), Validators.max(100)]),
    currentSavings: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
    monthlyContribution: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
  },
    {validators: targetAgeAfterCurrentAge },
    );

  protected showError(field: GoalField): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  ngOnInit(): void {
    const id = this.id();
    if (id === undefined) {
      return;
    }

    const goal = this.goalData.getGoal(Number(id));
    if (!goal){
      this.router.navigate(['/']);
      return;
    }

    this.form.patchValue(goal);
  }

  protected save(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    const goalValues = {
      name: value.name.trim(),
      currentAge: value.currentAge!,
      targetAmount: value.targetAmount!,
      targetAge: value.targetAge!,
      currentSavings: value.currentSavings!,
      monthlyContribution: value.monthlyContribution!,
    };

    const id = this.id();
    if (id === undefined) {
      this.goalData.addGoal(goalValues);
    } else {
      this.goalData.updateGoal({ ...goalValues, id: Number(id) });
    }
    this.router.navigate(['/']);
  }
}
