import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontheadComponent } from './fronthead.component';

describe('FrontheadComponent', () => {
  let component: FrontheadComponent;
  let fixture: ComponentFixture<FrontheadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FrontheadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrontheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
