import { TestBed } from '@angular/core/testing';

import { ValidKeyGuard } from './valid-key.guard';

describe('ValidKeyGuard', () => {
  let guard: ValidKeyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ValidKeyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
