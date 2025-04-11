import {
  Component
} from '@angular/core';
import { SidePanelComponent } from '../../../shared/components/side-panel/side-panel.component';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { MatCardModule } from '@angular/material/card';
import { AddEditRecipeComponent } from '../add-edit-recipe/add-edit-recipe.component';
import { InputBaseComponent } from '../../../shared/components/input-base/input-base.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DsInfiniteScrollDirective } from '../../../core/directives/ds-infinite-scroll.directive';
import { AddEdit } from '../../../core/enums/add-edit/add-edit.enum';
import { RecipesData } from '../../../shared/components/recipes-data/recipes-data.component';
import { LocalSpinnerComponent } from '../../../shared/components/local-spinner/local-spinner.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RecipeCardContentComponent } from '../../../shared/components/recipe-card-content/recipe-card-content.component';
import { ImageBoxComponent } from '../../../shared/components/image-box/image-box.component';

@Component({
  selector: 'app-recipes-list',
  imports: [
    SidePanelComponent,
    PageTitleComponent,
    MatCardModule,
    InputBaseComponent,
    MatButtonModule,
    MatIcon,
    RouterLink,
    DsInfiniteScrollDirective,
    LocalSpinnerComponent,
    ReactiveFormsModule,
    RecipeCardContentComponent,
    ImageBoxComponent
  ],
  templateUrl: './recipes-list.component.html',
  styleUrl: './recipes-list.component.scss',
})
export class RecipesListComponent extends RecipesData {
  addRecipe(): void {
    this.sidePanelService.openSidePanel(AddEditRecipeComponent, {
      data: {
        mode: AddEdit.ADD,
      },
      pageTitle: 'Create recipe',
    });
  }
}
