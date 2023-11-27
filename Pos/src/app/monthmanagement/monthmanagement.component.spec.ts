import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthmanagementComponent } from './monthmanagement.component';

describe('MonthmanagementComponent', () => {
  let component: MonthmanagementComponent;
  let fixture: ComponentFixture<MonthmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthmanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
