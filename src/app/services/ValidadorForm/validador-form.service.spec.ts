import { TestBed } from '@angular/core/testing';

import { ValidadorFormService } from './validador-form.service';

describe('ValidadorFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ValidadorFormService = TestBed.get(ValidadorFormService);
    expect(service).toBeTruthy();
  });
});
