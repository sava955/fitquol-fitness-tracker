import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateControllerCardComponent } from './date-controller-card.component';

describe('DateControllerCardComponent', () => {
  let component: DateControllerCardComponent;
  let fixture: ComponentFixture<DateControllerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateControllerCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateControllerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
