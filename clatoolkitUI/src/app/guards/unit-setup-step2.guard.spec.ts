import { TestBed, async, inject } from '@angular/core/testing';

import { UnitSetupStep2Guard } from './unit-setup-step2.guard';

describe('UnitSetupStep2Guard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitSetupStep2Guard]
    });
  });

  it('should ...', inject([UnitSetupStep2Guard], (guard: UnitSetupStep2Guard) => {
    expect(guard).toBeTruthy();
  }));
});
