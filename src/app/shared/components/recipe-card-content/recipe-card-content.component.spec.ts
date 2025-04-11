import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCardContentComponent } from './recipe-card-content.component';

describe('RecipeCardContentComponent', () => {
  let component: RecipeCardContentComponent;
  let fixture: ComponentFixture<RecipeCardContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeCardContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeCardContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
