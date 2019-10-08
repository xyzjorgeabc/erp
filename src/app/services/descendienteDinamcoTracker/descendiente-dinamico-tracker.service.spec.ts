import { TestBed } from '@angular/core/testing';

import { DescendienteDinamicoTrackerService } from './descendiente-dinamico-tracker.service';

describe('DescendienteDinamicoTrackerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DescendienteDinamicoTrackerService = TestBed.get(DescendienteDinamicoTrackerService);
    expect(service).toBeTruthy();
  });
});
