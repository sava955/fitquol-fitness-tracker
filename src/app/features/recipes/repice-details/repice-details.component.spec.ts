import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepiceDetailsComponent } from './repice-details.component';

describe('RepiceDetailsComponent', () => {
  let component: RepiceDetailsComponent;
  let fixture: ComponentFixture<RepiceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepiceDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepiceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
