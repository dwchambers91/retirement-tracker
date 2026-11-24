import { TestBed } from '@angular/core/testing';
import { GoalData } from './goal-data';

describe('GoalData', () => {
  let service: GoalData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoalData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('adds a goal with a new unique id', () => {
    const before = service.goals().length;

    const added = service.addGoal({
      name: 'Test Goal',
      currentAge: 40,
      targetAmount: 500_000,
      targetAge: 65,
      currentSavings: 1_000,
      monthlyContribution: 200,
    });

    const ids = service.goals().map((g) => g.id);
    expect(service.goals().length).toBe(before + 1);
    expect(service.goals()).toContainEqual(added);
    expect(new Set(ids).size).toBe(ids.length);
  })
});
