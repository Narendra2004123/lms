import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentformComponent } from './indentform.component';

describe('IndentformComponent', () => {
  let component: IndentformComponent;
  let fixture: ComponentFixture<IndentformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndentformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
