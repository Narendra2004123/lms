import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SCoursesComponent } from './Scourses.component';

describe('SCoursesComponent', () => {
  let component: SCoursesComponent;
  let fixture: ComponentFixture<SCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SCoursesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
