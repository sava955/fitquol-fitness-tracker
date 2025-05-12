import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayMacroStatisticComponent } from './today-macro-statistic.component';

describe('TodayMacroStatisticComponent', () => {
  let component: TodayMacroStatisticComponent;
  let fixture: ComponentFixture<TodayMacroStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayMacroStatisticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayMacroStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
