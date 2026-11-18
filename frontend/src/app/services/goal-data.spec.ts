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
});
