import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { GoalsDashboard } from './goals-dashboard';
import { GoalData } from '../services/goal-data';
import { Goal } from '../models/goal.model';
import {provideRouter} from '@angular/router';
import {vi} from 'vitest';

describe('GoalsDashboard', () => {
  const fakeGoals = signal<Goal[]>([]);
  const deleteGoal =vi.fn();
  let fixture: ComponentFixture<GoalsDashboard>;
  let page: HTMLElement;

  beforeEach(async () => {
    fakeGoals.set([]);
    deleteGoal.mockReset();

    await TestBed.configureTestingModule({
      imports: [GoalsDashboard],
      providers: [
        provideRouter([]),
        { provide: GoalData, useValue: { goals: fakeGoals.asReadonly(), deleteGoal: deleteGoal } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalsDashboard);
    page = fixture.nativeElement;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const oneGoal: Goal = { id: 7, name: 'Retire at 60', currentAge: 35, targetAge: 60, targetAmount: 1_200_000, currentSavings: 85_000, monthlyContribution: 1_500 };

  it('links each goal to its edit page', async () => {
    fakeGoals.set([oneGoal]);
    await fixture.whenStable();

    expect(page.querySelector('[data-testid="edit-link"]')?.getAttribute('href')).toBe('/goals/7/edit');
  });

  it('deletes a goal after the user confirms', async () => {
    fakeGoals.set([oneGoal]);
    await fixture.whenStable();
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    page.querySelector<HTMLButtonElement>('[data-testid="delete-button"]')!.click();

    expect(deleteGoal).toHaveBeenCalledWith(7);
  });

  it('keeps the goal when the user cancels', async () => {
    fakeGoals.set([oneGoal]);
    await fixture.whenStable();
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    page.querySelector<HTMLButtonElement>('[data-testid="delete-button"]')!.click();

    expect(deleteGoal).not.toHaveBeenCalled();
  });

  it('shows "On track" when savings already meet the target', async () => {
    fakeGoals.set([
      { id: 1, name: 'Covered', currentAge: 30, targetAge: 60, targetAmount: 100_000, currentSavings: 200_000, monthlyContribution: 0 },
    ]);
    await fixture.whenStable();

    expect(page.querySelector('[data-testid="goal-status"]')?.textContent).toContain('On track');
    expect(page.querySelector('[data-testid="extra-needed"]')).toBeNull();
  });

  it('shows "Behind" and the extra monthly amount when short of the target', async () => {
    fakeGoals.set([
      { id: 1, name: 'Short', currentAge: 30, targetAge: 60, targetAmount: 1_000_000, currentSavings: 0, monthlyContribution: 0 },
    ]);
    await fixture.whenStable();

    expect(page.querySelector('[data-testid="goal-status"]')?.textContent).toContain('Behind');
    expect(page.querySelector('[data-testid="extra-needed"]')).toBeTruthy();
  });

  it('shows a message when there are no goals', async () => {
    await fixture.whenStable();

    expect(page.querySelector('[data-testid="empty-message"]')).toBeTruthy();
    expect(page.querySelectorAll('[data-testid="goal-card"]').length).toBe(0);
  });

  it('shows one card per goal with its name, target amount, and age', async () => {
    fakeGoals.set([
      { id: 1, name: 'Retire at 60', currentAge:30, targetAmount: 1_200_000, targetAge: 60, currentSavings: 0, monthlyContribution: 0 },
      { id: 2, name: 'Early retirement', currentAge:30, targetAmount: 1_500_000, targetAge: 55, currentSavings: 0, monthlyContribution: 0 },
    ]);
    await fixture.whenStable();



    const cards = page.querySelectorAll('[data-testid="goal-card"]');
    expect(cards.length).toBe(2);
    expect(cards[0].textContent).toContain('Retire at 60');
    expect(cards[0].textContent).toContain('$1,200,000');
    expect(cards[0].textContent).toContain('age 60');
    expect(page.querySelector('[data-testid="empty-message"]')).toBeNull();
  });
});
