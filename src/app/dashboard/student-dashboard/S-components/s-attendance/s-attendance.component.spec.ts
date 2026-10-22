import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SAttendanceComponent } from './s-attendance.component';

describe('SAttendanceComponent', () => {
  let component: SAttendanceComponent;
  let fixture: ComponentFixture<SAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
