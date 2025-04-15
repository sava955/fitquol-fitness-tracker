import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayCaloriesCardComponent } from './today-calories-card.component';

describe('TodayCaloriesCardComponent', () => {
  let component: TodayCaloriesCardComponent;
  let fixture: ComponentFixture<TodayCaloriesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayCaloriesCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayCaloriesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
