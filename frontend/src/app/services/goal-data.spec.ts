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

  it('finds a goal by id, or returns undefined', () => {
    const first = service.goals()[0];

    expect(service.getGoal(first.id)).toEqual(first);
    expect(service.getGoal(-1)).toBeUndefined();
  });

  it('updates only the goal with a matching id', () => {
    const [first, second] = service.goals();

    service.updateGoal({ ...first, name: 'Renamed' });

    expect(service.getGoal(first.id)?.name).toBe('Renamed');
    expect(service.getGoal(second.id)).toEqual(second);
  });

  it('deletes only the goal with a matching id', () => {
    const [first, second] = service.goals();

    service.deleteGoal(first.id);

    expect(service.getGoal(first.id)).toBeUndefined();
    expect(service.getGoal(second.id)).toEqual(second);
  });
});
