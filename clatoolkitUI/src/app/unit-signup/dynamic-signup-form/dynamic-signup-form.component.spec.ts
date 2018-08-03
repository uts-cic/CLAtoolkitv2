import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSignupFormComponent } from './dynamic-signup-form.component';

describe('DynamicSignupFormComponent', () => {
  let component: DynamicSignupFormComponent;
  let fixture: ComponentFixture<DynamicSignupFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicSignupFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicSignupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
