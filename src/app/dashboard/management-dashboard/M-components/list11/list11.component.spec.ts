import { ComponentFixture, TestBed } from '@angular/core/testing';

import { List11Component } from './list11.component';

describe('List11Component', () => {
  let component: List11Component;
  let fixture: ComponentFixture<List11Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [List11Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(List11Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
