import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitSetupComponent } from './unit-setup.component';

describe('UnitSetupComponent', () => {
  let component: UnitSetupComponent;
  let fixture: ComponentFixture<UnitSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
