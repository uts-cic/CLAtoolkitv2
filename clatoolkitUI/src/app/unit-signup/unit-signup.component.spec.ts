import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitSignupComponent } from './unit-signup.component';

describe('UnitSignupComponent', () => {
  let component: UnitSignupComponent;
  let fixture: ComponentFixture<UnitSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
