import { TestBed, async, inject } from '@angular/core/testing';

import { UnitSetupStep3Guard } from './unit-setup-step3.guard';

describe('UnitSetupStep3Guard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitSetupStep3Guard]
    });
  });

  it('should ...', inject([UnitSetupStep3Guard], (guard: UnitSetupStep3Guard) => {
    expect(guard).toBeTruthy();
  }));
});
