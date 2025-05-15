import { Component, inject } from '@angular/core';
import { SidePanelComponent } from '../../../../shared/components/side-panel/side-panel.component';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { AddEditRecipeComponent } from '../add-edit-recipe/add-edit-recipe.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DsInfiniteScrollDirective } from '../../../../core/directives/ds-infinite-scroll.directive';
import { AddEdit } from '../../../../core/enums/add-edit.enum';
import { RecipesData } from '../../../../shared/components/recipes-data/recipes-data.component';
import { LocalSpinnerComponent } from '../../../../shared/components/local-spinner/local-spinner.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NoDataFoundComponent } from '../../../../shared/components/no-data-found/no-data-found.component';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';
import { Recipe } from '../../models/recipe.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipes-list',
  imports: [
    SidePanelComponent,
    PageTitleComponent,
    InputComponent,
    MatButtonModule,
    MatIcon,
    DsInfiniteScrollDirective,
    LocalSpinnerComponent,
    ReactiveFormsModule,
    NoDataFoundComponent,
    RecipeCardComponent
  ],
  templateUrl: './recipes-list.component.html',
  styleUrl: './recipes-list.component.scss',
})
export class RecipesListComponent extends RecipesData {
  private readonly router = inject(Router);

  addRecipe(): void {
    this.sidePanelService.openSidePanel(AddEditRecipeComponent, {
      mode: AddEdit.ADD,
      pageTitle: 'Create recipe',
    });
  }

  openDetails(recipe: Recipe): void {
    this.router.navigate(['recipes/', recipe._id]);
  }
}
