import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesFoodsComponent } from './recipes-foods.component';

describe('RecipesFoodsComponent', () => {
  let component: RecipesFoodsComponent;
  let fixture: ComponentFixture<RecipesFoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipesFoodsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipesFoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
