import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../../../core/models/recipes/recipes.interface';
import { RecipesService } from '../../../core/services/recipes/recipes.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SidePanelComponent } from '../../../shared/components/side-panel/side-panel.component';
import { SidePanelService } from '../../../shared/services/side-panel/side-panel.service';
import { AddEditRecipeComponent } from '../add-edit-recipe/add-edit-recipe.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NutrientsComponent } from '../../../shared/components/nutrients/nutrients.component';
import { AddEdit } from '../../../core/enums/add-edit/add-edit.enum';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { LocalSpinnerComponent } from '../../../shared/components/local-spinner/local-spinner.component';
import { LocalSpinnerService } from '../../../shared/services/local-spinner/local-spinner.service';
import { withLocalAppSpinner } from '../../../shared/utils/with-local-spinner';
import { MatListModule } from '@angular/material/list';
import { ImageBoxComponent } from '../../../shared/components/image-box/image-box.component';
import { RecipeCardContentComponent } from '../../../shared/components/recipe-card-content/recipe-card-content.component';

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
    RecipeCardContentComponent
],
  templateUrl: './repice-details.component.html',
  styleUrl: './repice-details.component.scss',
})
export class RepiceDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly sidePanelService = inject(SidePanelService);
  private readonly recipesService = inject(RecipesService);
  private readonly spinnerService = inject(LocalSpinnerService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly dialog = inject(MatDialog);

  recipeData =
    this.sidePanelService.drawerStack()[
      this.sidePanelService.drawerStack().length - 1
    ]?.data.data?.recipe;

  recipe!: Recipe;

  ngOnInit(): void {
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
    }
  }

  getRecipe(id: string): void {
    this.recipesService
      .getRecipe(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        withLocalAppSpinner(this.spinnerService)
      )
      .subscribe((response) => {
        this.recipe = response;
      });
  }

  editRecipe(): void {
    this.sidePanelService.openSidePanel(AddEditRecipeComponent, {
      data: {
        recipe: this.recipe,
        mode: AddEdit.EDIT,
      },
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
    this.recipesService.deleteRecipe(id).subscribe((response) => {
      this.router.navigateByUrl('recipes');
    });
  }

  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  goBack(): void {
    if (this.recipeData) {
      this.sidePanelService.closeTopComponent();
    } else {
      this.router.navigateByUrl('recipes');
    }
  }
}
