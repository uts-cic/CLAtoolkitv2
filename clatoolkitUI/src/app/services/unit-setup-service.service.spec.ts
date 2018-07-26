import { TestBed, inject } from '@angular/core/testing';

import { UnitSetupServiceService } from './unit-setup-service.service';

describe('UnitSetupServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitSetupServiceService]
    });
  });

  it('should be created', inject([UnitSetupServiceService], (service: UnitSetupServiceService) => {
    expect(service).toBeTruthy();
  }));
});
