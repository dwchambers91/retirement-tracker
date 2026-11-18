import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { GoalForm } from './goal-form';
import { GoalData } from '../services/goal-data';

describe('GoalForm', () => {
  const addGoal = vi.fn();
  let fixture: ComponentFixture<GoalForm>;
  let page: HTMLElement;
  let router: Router;

  beforeEach(async () => {
    addGoal.mockReset();

    await TestBed.configureTestingModule({
      imports: [GoalForm],
      providers: [provideRouter([]), { provide: GoalData, useValue: { addGoal } }],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(GoalForm);
    page = fixture.nativeElement;
    await fixture.whenStable();
  });

  function type(testId: string, value: string): void {
    const input = page.querySelector<HTMLInputElement>(`[data-testid="${testId}"]`)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  function fillValidForm(): void {
    type('name-input', 'Retire at 62');
    type('target-amount-input', '900000');
    type('target-age-input', '62');
    type('current-savings-input', '40000');
    type('monthly-contribution-input', '1000');
  }

  async function submit(): Promise<void> {
    page.querySelector<HTMLButtonElement>('[data-testid="save-button"]')!.click();
    await fixture.whenStable();
  }

  it('does not save and shows an error when a required field is empty', async () => {
    fillValidForm();
    type('name-input', '');

    await submit();

    expect(page.querySelector('[data-testid="name-error"]')).toBeTruthy();
    expect(addGoal).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('does not save and shows an error for a negative amount', async () => {
    fillValidForm();
    type('current-savings-input', '-50');

    await submit();

    expect(page.querySelector('[data-testid="current-savings-error"]')).toBeTruthy();
    expect(addGoal).not.toHaveBeenCalled();
  });

  it('saves a valid goal and returns to the dashboard', async () => {
    fillValidForm();

    await submit();

    expect(addGoal).toHaveBeenCalledWith({
      name: 'Retire at 62',
      targetAmount: 900_000,
      targetAge: 62,
      currentSavings: 40_000,
      monthlyContribution: 1_000,
    });
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
