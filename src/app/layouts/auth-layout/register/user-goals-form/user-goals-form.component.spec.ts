import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGoalsFormComponent } from './user-goals-form.component';

describe('UserGoalsFormComponent', () => {
  let component: UserGoalsFormComponent;
  let fixture: ComponentFixture<UserGoalsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserGoalsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserGoalsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
