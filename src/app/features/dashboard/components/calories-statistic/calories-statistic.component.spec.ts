import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaloriesStatisticComponent } from './calories-statistic.component';

describe('CaloriesStatisticComponent', () => {
  let component: CaloriesStatisticComponent;
  let fixture: ComponentFixture<CaloriesStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaloriesStatisticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaloriesStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
