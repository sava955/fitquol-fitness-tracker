import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacrosChartComponent } from './macros-chart.component';

describe('MacrosChartComponent', () => {
  let component: MacrosChartComponent;
  let fixture: ComponentFixture<MacrosChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MacrosChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MacrosChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
