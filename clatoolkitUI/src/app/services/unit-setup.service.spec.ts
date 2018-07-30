import { TestBed, inject } from '@angular/core/testing';

import { UnitSetupService } from './unit-setup.service';

describe('UnitSetupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitSetupService]
    });
  });

  it('should be created', inject([UnitSetupService], (service: UnitSetupService) => {
    expect(service).toBeTruthy();
  }));
});
