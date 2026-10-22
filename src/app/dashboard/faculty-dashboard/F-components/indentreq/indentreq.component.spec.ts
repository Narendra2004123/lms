import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentreqComponent } from './indentreq.component';

describe('IndentreqComponent', () => {
  let component: IndentreqComponent;
  let fixture: ComponentFixture<IndentreqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndentreqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentreqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
