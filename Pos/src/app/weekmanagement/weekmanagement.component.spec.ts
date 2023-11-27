import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekmanagementComponent } from './weekmanagement.component';

describe('WeekmanagementComponent', () => {
  let component: WeekmanagementComponent;
  let fixture: ComponentFixture<WeekmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeekmanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
