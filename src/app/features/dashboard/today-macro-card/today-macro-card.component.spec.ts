import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayMacroCardComponent } from './today-macro-card.component';

describe('TodayMacroCardComponent', () => {
  let component: TodayMacroCardComponent;
  let fixture: ComponentFixture<TodayMacroCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayMacroCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayMacroCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
