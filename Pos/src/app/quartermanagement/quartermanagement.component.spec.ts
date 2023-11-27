import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuartermanagementComponent } from './quartermanagement.component';

describe('QuartermanagementComponent', () => {
  let component: QuartermanagementComponent;
  let fixture: ComponentFixture<QuartermanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuartermanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuartermanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
