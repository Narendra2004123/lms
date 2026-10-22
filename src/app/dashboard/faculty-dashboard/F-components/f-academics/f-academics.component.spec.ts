import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FAcademicsComponent } from './f-academics.component';

describe('FAcademicsComponent', () => {
  let component: FAcademicsComponent;
  let fixture: ComponentFixture<FAcademicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FAcademicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FAcademicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
