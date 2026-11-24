import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { GoalForm } from './goal-form';
import { GoalData } from '../services/goal-data';
import { Goal } from '../models/goal.model';

const existingGoal: Goal = {
  id: 7,
  name: 'Retire at 60',
  currentAge: 35,
  targetAge: 60,
  targetAmount: 1_200_000,
  currentSavings: 85_000,
  monthlyContribution: 1_500,
};

describe('GoalForm', () => {
  const addGoal = vi.fn();
  const updateGoal = vi.fn();
  const getGoal = vi.fn();
  let fixture: ComponentFixture<GoalForm>;
  let page: HTMLElement;
  let router: Router;

  beforeEach(async () => {
    addGoal.mockReset();
    updateGoal.mockReset();
    getGoal.mockReset();

    await TestBed.configureTestingModule({
      imports: [GoalForm],
      providers: [provideRouter([]), { provide: GoalData, useValue: { addGoal, updateGoal, getGoal } }],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(GoalForm);
    page = fixture.nativeElement;
  });

  async function render(id?: string): Promise<void> {
    if (id !== undefined) {
      fixture.componentRef.setInput('id', id);
    }
    await fixture.whenStable();
  }

  function input(testId: string): HTMLInputElement {
    return page.querySelector<HTMLInputElement>(`[data-testid="${testId}"]`)!;
  }

  function type(testId: string, value: string): void {
    input(testId).value = value;
    input(testId).dispatchEvent(new Event('input'));
  }

  function fillValidForm(): void {
    type('name-input', 'Retire at 62');
    type('current-age-input', '35');
    type('target-amount-input', '900000');
    type('target-age-input', '62');
    type('current-savings-input', '40000');
    type('monthly-contribution-input', '1000');
  }

  async function submit(): Promise<void> {
    page.querySelector<HTMLButtonElement>('[data-testid="save-button"]')!.click();
    await fixture.whenStable();
  }

  describe('creating a goal', () => {
    beforeEach(async () => {
      await render();
    });

    it('shows the create title', () => {
      expect(page.querySelector('[data-testid="form-title"]')?.textContent).toContain('Create a goal');
    });

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

    it('does not save when the target age is not after the current age', async () => {
      fillValidForm();
      type('current-age-input', '62');

      await submit();

      expect(page.querySelector('[data-testid="target-age-order-error"]')).toBeTruthy();
      expect(addGoal).not.toHaveBeenCalled();
    });

    it('saves a valid goal and returns to the dashboard', async () => {
      fillValidForm();

      await submit();

      expect(addGoal).toHaveBeenCalledWith({
        name: 'Retire at 62',
        currentAge: 35,
        targetAmount: 900_000,
        targetAge: 62,
        currentSavings: 40_000,
        monthlyContribution: 1_000,
      });
      expect(updateGoal).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('editing a goal', () => {
    it('fills the form with the existing goal', async () => {
      getGoal.mockReturnValue(existingGoal);

      await render('7');

      expect(getGoal).toHaveBeenCalledWith(7);
      expect(page.querySelector('[data-testid="form-title"]')?.textContent).toContain('Edit goal');
      expect(input('name-input').value).toBe('Retire at 60');
      expect(input('target-amount-input').value).toBe('1200000');
    });

    it('saves changes under the same id and returns to the dashboard', async () => {
      getGoal.mockReturnValue(existingGoal);
      await render('7');

      type('name-input', 'Retire at 62');
      await submit();

      expect(updateGoal).toHaveBeenCalledWith({ ...existingGoal, name: 'Retire at 62' });
      expect(addGoal).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('returns to the dashboard when the goal does not exist', async () => {
      getGoal.mockReturnValue(undefined);

      await render('999');

      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
