import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitLrsSetupComponent } from './unit-lrs-setup.component';

describe('UnitLrsSetupComponent', () => {
  let component: UnitLrsSetupComponent;
  let fixture: ComponentFixture<UnitLrsSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitLrsSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitLrsSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
