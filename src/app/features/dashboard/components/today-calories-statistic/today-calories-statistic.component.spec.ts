import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayCaloriesStatisticComponent } from './today-calories-statistic.component';

describe('TodayCaloriesStatisticComponent', () => {
  let component: TodayCaloriesStatisticComponent;
  let fixture: ComponentFixture<TodayCaloriesStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayCaloriesStatisticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayCaloriesStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
