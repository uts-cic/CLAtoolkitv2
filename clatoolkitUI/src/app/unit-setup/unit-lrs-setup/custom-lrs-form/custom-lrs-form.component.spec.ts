import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomLrsFormComponent } from './custom-lrs-form.component';

describe('CustomLrsFormComponent', () => {
  let component: CustomLrsFormComponent;
  let fixture: ComponentFixture<CustomLrsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomLrsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomLrsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
