import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaloriesBalanceComponent } from './calories-balance.component';

describe('CaloriesBalanceComponent', () => {
  let component: CaloriesBalanceComponent;
  let fixture: ComponentFixture<CaloriesBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaloriesBalanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaloriesBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
