import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisesStatisticComponent } from './exercises-statistic.component';

describe('ExercisesChartComponent', () => {
  let component: ExercisesChartComponent;
  let fixture: ComponentFixture<ExercisesChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExercisesChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExercisesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
