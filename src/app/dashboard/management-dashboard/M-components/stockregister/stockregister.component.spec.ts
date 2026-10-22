import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockregisterComponent } from './stockregister.component';

describe('StockregisterComponent', () => {
  let component: StockregisterComponent;
  let fixture: ComponentFixture<StockregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockregisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
