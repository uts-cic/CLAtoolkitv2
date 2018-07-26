import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitSocialmediaSetupComponent } from './unit-socialmedia-setup.component';

describe('UnitSocialmediaSetupComponent', () => {
  let component: UnitSocialmediaSetupComponent;
  let fixture: ComponentFixture<UnitSocialmediaSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitSocialmediaSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitSocialmediaSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
