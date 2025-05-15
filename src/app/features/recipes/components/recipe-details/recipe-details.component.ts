import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SidePanelComponent } from '../../../../shared/components/side-panel/side-panel.component';
import { SidePanelService } from '../../../../core/services/side-panel/side-panel.service';
import { AddEditRecipeComponent } from '../add-edit-recipe/add-edit-recipe.component';
import { NutrientsComponent } from '../../../../shared/components/nutrients/nutrients.component';
import { AddEdit } from '../../../../core/enums/add-edit.enum';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';
import { LocalSpinnerComponent } from '../../../../shared/components/local-spinner/local-spinner.component';
import { LocalSpinnerService } from '../../../../core/services/local-spinner/local-spinner.service';
import { withLocalAppSpinner } from '../../../../core/utils/with-local-spinner';
import { MatListModule } from '@angular/material/list';
import { ImageBoxComponent } from '../image-box/image-box.component';
import { NutrientData, Nutrients } from '../../../../core/models/nutrient.interface';
import { User } from '../../../user/models/user.interface';
import { UserService } from '../../../user/services/user.service';
import { RecipesService } from '../../services/recipes.service';
import { Recipe } from '../../models/recipe.interface';
import { MacrosChartComponent } from '../../../../shared/components/macros-chart/macros-chart.component';
import { recipeMealResponsiveChart } from '../../../../core/const/recipe-meal-responsive-chart';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-repice-details',
  imports: [
    PageTitleComponent,
    MatButtonModule,
    MatIcon,
    SidePanelComponent,
    NutrientsComponent,
    MatCardModule,
    LocalSpinnerComponent,
    MatListModule,
    ImageBoxComponent,
    MacrosChartComponent,
    MatTooltipModule
],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.scss',
})
export class RecipeDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly sidePanelService = inject(SidePanelService);
  private readonly recipesService = inject(RecipesService);
  private readonly spinnerService = inject(LocalSpinnerService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);

  recipeData!: Recipe;
  recipe!: Recipe;
  nutrients!: Nutrients;

  currentUser!: User;

  responsive = recipeMealResponsiveChart;

  ngOnInit(): void {
    this.userService.getAuthenticatedUser().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((response) => {
      this.currentUser = response!;

      if (!this.recipeData) {
        const id = this.route.snapshot.paramMap.get('id')!;
  
        this.getRecipe(id);
  
        this.sidePanelService.onCloseSidePanel().subscribe((response) => {
          if (response) {
            this.getRecipe(id);
          }
        });
      } else {
        this.recipe = this.recipeData;
        this.nutrients = this.recipe.nutrients as Nutrients;
      }
    })
  }

  getRecipe(id: string): void {
    this.recipesService
      .getById(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        withLocalAppSpinner(this.spinnerService)
      )
      .subscribe((response) => {
        this.recipe = response.data;
        this.nutrients = this.recipe.nutrients as Nutrients;
      });
  }

  editRecipe(): void {
    this.sidePanelService.openSidePanel(AddEditRecipeComponent, {
      recipe: this.recipe,
      mode: AddEdit.EDIT,
      pageTitle: 'Edit recipe',
    });
  }

  onDeleteRecipe(): void {
    this.dialog.open(DialogComponent, {
      data: {
        title: 'Delete recipe',
        message: 'Are you sure you want to delete this recipe?',
        onConfirm: () => {
          this.deleteRecipe(this.recipe._id!);
        },
      },
      width: '500px',
    });
  }

  deleteRecipe(id: string): void {
    this.recipesService.delete(id).subscribe(_ => {
      this.router.navigateByUrl('recipes');
    });
  }

  goBack(): void {
    if (this.recipeData) {
      this.sidePanelService.closeTopComponent();
    } else {
      this.router.navigateByUrl('recipes');
    }
  }

  getMacronutrients(nutrients: Nutrients): NutrientData[] {
    const nutrientsMap = new Map(nutrients.macronutrients.map((d) => [d.key, d]));

    const calories = nutrientsMap.get('calories')!;
    const carbohydrates = nutrientsMap.get('carbohydrates')!;
    const protein = nutrientsMap.get('protein')!;
    const fats = nutrientsMap.get('fats')!;

    const macros = [calories, carbohydrates, protein, fats];

    return macros;
  }
}
