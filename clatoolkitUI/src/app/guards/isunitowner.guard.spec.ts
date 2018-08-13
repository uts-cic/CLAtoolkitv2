import { TestBed, async, inject } from '@angular/core/testing';

import { IsunitownerGuard } from './isunitowner.guard';

describe('IsunitownerGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsunitownerGuard]
    });
  });

  it('should ...', inject([IsunitownerGuard], (guard: IsunitownerGuard) => {
    expect(guard).toBeTruthy();
  }));
});
