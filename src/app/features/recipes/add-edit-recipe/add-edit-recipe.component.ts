import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SidePanelService } from '../../../shared/services/side-panel/side-panel.service';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { FormBaseComponent } from '../../../shared/components/form-base/form-base.component';
import { InputBaseComponent } from '../../../shared/components/input-base/input-base.component';
import { ActionButtons } from '../../../core/models/action-buttons/action.buttons.interface';
import { AddEdit } from '../../../core/enums/add-edit/add-edit.enum';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { debounceTime, map, Observable, of, startWith, switchMap } from 'rxjs';
import { MealsService } from '../../../core/services/meals/meals.service';
import { Meal } from '../../../core/models/meals/meal.interface';
import { MatCardModule } from '@angular/material/card';
import { NutrientsComponent } from '../../../shared/components/nutrients/nutrients.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { calculateNutritientsForQuantity } from '../../../shared/utils/calculate-nutrients-for-quantity';
import { setMacronutrients } from '../../../shared/utils/calculate-macronutrients';
import { setMicronutrients } from '../../../shared/utils/calculate-micronutrients';
import { DietsService } from '../../../shared/services/diets/diets.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RecipesService } from '../../../core/services/recipes/recipes.service';
import { RecipeCategoriesService } from '../../../shared/services/recipe-categories/recipe-categories.service';
import { mealTypes } from '../../../core/const/meals/meal-types';
import { Router } from '@angular/router';
import {
  Recipe,
  RecipeCategory,
} from '../../../core/models/recipes/recipes.interface';
import { SelectBaseComponent } from '../../../shared/components/select-base/select-base.component';
import { AutocompleteBaseComponent } from '../../../shared/components/autocomplete-base/autocomplete-base.component';
import { TextareaBaseComponent } from '../../../shared/components/textarea-base/textarea-base.component';
import { ImageBoxComponent } from '../../../shared/components/image-box/image-box.component';
import { Macronutrients, Micronutrients, Nutrients, PlainNutrients } from '../../../core/models/nutrients/nutrient.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Goal } from '../../../core/models/goals/goal';

@Component({
  selector: 'app-add-edit-recipe',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageTitleComponent,
    FormBaseComponent,
    InputBaseComponent,
    MatButtonModule,
    MatIcon,
    MatCardModule,
    NutrientsComponent,
    MatExpansionModule,
    SelectBaseComponent,
    AutocompleteBaseComponent,
    TextareaBaseComponent,
    SelectBaseComponent,
    ImageBoxComponent,
  ],
  templateUrl: './add-edit-recipe.component.html',
  styleUrl: './add-edit-recipe.component.scss',
})
export class AddEditRecipeComponent implements OnInit {
  private readonly sidePanelService = inject(SidePanelService);
  private readonly fb = inject(FormBuilder);
  private readonly mealsService = inject(MealsService);
  private readonly dietsService = inject(DietsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly recipesService = inject(RecipesService);
  private readonly recepeCategories = inject(RecipeCategoriesService);
  private readonly router = inject(Router);

  mode =
    this.sidePanelService.drawerStack()[
      this.sidePanelService.drawerStack().length - 1
    ]?.data.data?.mode;
  pageTitle =
    this.sidePanelService.drawerStack()[
      this.sidePanelService.drawerStack().length - 1
    ]?.data.pageTitle;

  recipeForm = this.fb.group({
    image: [''],
    name: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.maxLength(400)]],
    preparationTime: [0, [Validators.required, Validators.min(1)]],
    cookingTime: [0, [Validators.required, Validators.min(1)]],
    servings: [1, [Validators.required, Validators.min(1)]],
    mealType: ['', Validators.required],
    category: [new FormControl(), Validators.required],
    ingredients: this.fb.array(
      this.mode === AddEdit.ADD ? [this.createIngredient()] : []
    ),
    instructions: this.fb.array(
      this.mode === AddEdit.ADD ? [this.createInstruction()] : []
    ),
  });

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructions(): FormArray {
    return this.recipeForm.get('instructions') as FormArray;
  }

  actionBtns: ActionButtons[] = [
    {
      label: 'Cancel',
      action: () => {
        this.sidePanelService.closeTopComponent();
      },
      style: 'secondary',
    },
    {
      label: this.mode === AddEdit.ADD ? 'Create recipe' : 'Update recipe',
      action: () => {
        this.mode === AddEdit.ADD ? this.addRecipe() : this.updateRecipe();
      },
    },
  ];

  userGoal!: Goal;
  recipe!: Recipe;

  mealOptions = mealTypes;

  filteredCategories!: Observable<RecipeCategory[]>;

  filteredOptions!: Observable<Meal[]>[];

  selectedIndrigents: Meal[] = [];

  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  nutrientsArr: Nutrients[] = [];

  recipeNutrients!: Nutrients;

  nutrients!: PlainNutrients;

  errorMessage!: string;

  ngOnInit(): void {
    this.dietsService
      .getGoals()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        this.userGoal = response;

        if (this.mode === AddEdit.EDIT) {
          this.recipe =
            this.sidePanelService.drawerStack()[
              this.sidePanelService.drawerStack().length - 1
            ]?.data.data?.recipe;

          this.setFormData();
        }
      });

    this.onFormEvent();
  }

  createIngredient(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
    });
  }

  createInstruction(): FormGroup {
    return this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  setFormData(): void {
    const name = this.recipeForm.get('name');
    const description = this.recipeForm.get('description');
    const category = this.recipeForm.get('category');
    const mealType = this.recipeForm.get('mealType');
    const preparationTime = this.recipeForm.get('preparationTime');
    const cookingTime = this.recipeForm.get('cookingTime');
    const servings = this.recipeForm.get('servings');

    this.previewUrl = this.recipe.image;
    name?.setValue(this.recipe.name);
    description?.setValue(this.recipe.description);
    category?.setValue(this.recipe.category);
    mealType?.setValue(this.recipe.mealType);
    preparationTime?.setValue(this.recipe.preparationTime);
    cookingTime?.setValue(this.recipe.cookingTime);
    servings?.setValue(this.recipe.servings);

    this.recipe.ingredients.forEach((ingredient, index) => {
      this.ingredients.push(this.createIngredient());
      this.selectedIndrigents.push(ingredient);

      this.setupIngredientAutocomplete();

      this.ingredients.controls[index].get('name')?.setValue(ingredient);
      this.ingredients.controls[index]
        .get('quantity')
        ?.setValue(ingredient.quantity);
    });

    this.recipe.instructions.forEach((instruction, index) => {
      this.instructions.push(this.createInstruction());

      this.instructions.controls[index]
        .get('description')
        ?.setValue(instruction.description);
    });
  }

  onFormEvent(): void {
    this.filteredCategories = this.recipeForm
      .get('category')
      ?.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        switchMap((value) => {
          if (!value) {
            return of([]);
          }
          return this.searchCategories(value);
        })
      )!;

    this.recipeForm.get('servings')?.valueChanges.subscribe((_) => {
      this.ingredients.controls.forEach((control, index) => {
        const quantity = control.get('quantity')?.value!;
        
        this.calculateNutrients(quantity, index);
      });
    });

    this.setupIngredientAutocomplete();
  }

  searchCategories(query: string): Observable<RecipeCategory[]> {
    if (!query || query.length < 2) {
      return of([]);
    }
    return this.recepeCategories
      .getRecipeCategories({ name: query })
      .pipe(map((response) => response || []));
  }

  setupIngredientAutocomplete(): void {
    this.filteredOptions = this.ingredients.controls.map((control) =>
      control.get('name')!.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        switchMap((value) => this.searchIngredients(value))
      )
    );

    this.ingredients.controls.forEach((control, index) =>
      control.get('quantity')!.valueChanges.subscribe((value) => {
        if (Number(value) > 0) {
          const quantity = Number(value);
          
          this.calculateNutrients(quantity, index);

          this.selectedIndrigents[index] = {
            ...this.selectedIndrigents[index],
            quantity: quantity,
            nutrients: { ...this.nutrientsArr[index] },
          };
        }
      })
    );
  }

  searchIngredients(query: string): Observable<Meal[]> {
    if (!query || query.length < 2) {
      return of([]);
    };

    return this.mealsService
      .getMeals({ extraParams: { food: query } })
      .pipe(map((response) => response || []));
  }

  addIngredient(): void {
    this.ingredients.push(this.createIngredient());
    this.setupIngredientAutocomplete();
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
    this.filteredOptions.splice(index, 1);
    this.selectedIndrigents.splice(index, 1);
    this.nutrientsArr.splice(index, 1);
    this.calculateRecipeNutrients();
  }

  addInstruction(): void {
    this.instructions.push(this.createInstruction());
  }

  removeInstruction(index: number): void {
    this.instructions.removeAt(index);
  }

  getControl(index: number, control: string): FormControl {
    return this.ingredients.at(index).get(control) as FormControl;
  }

  addIngredientData(event: MatAutocompleteSelectedEvent, i: number): void {
    this.selectedIndrigents[i] = event.option.value;
    const quantity = this.ingredients.controls[i].get('quantity');
    quantity?.setValue(this.selectedIndrigents[i].quantity);
  }

  calculateNutrients(quantity: number, index: number): void {
    if (quantity && quantity > 0) {
      this.nutrientsArr[index] = {
        ...calculateNutritientsForQuantity(
          this.selectedIndrigents[index],
          quantity
        )!,
      };

      this.calculateRecipeNutrients();
    }
  }

  calculateRecipeNutrients(): void {
    if (this.selectedIndrigents.length === 0) {
      return;
    }

    const macronutrientsTotals: Macronutrients = {};
    const micronutrientsTotals: Micronutrients = {};

    let caloriesTotal: number = 0;

    this.nutrientsArr.forEach((item) => {
      caloriesTotal += item.calories;

      item.macronutrients.forEach((nutrient) => {
        const nutrientKey = nutrient.key as keyof Macronutrients;

        if (!macronutrientsTotals[nutrientKey]) {
          macronutrientsTotals[nutrientKey] = 0;
        }
        macronutrientsTotals[nutrientKey] +=
          nutrient.value / this.recipeForm.get('servings')?.value!;
      });

      item.micronutrients.forEach((nutrient) => {
        const nutrientKey = nutrient.key as keyof Micronutrients;

        if (!micronutrientsTotals[nutrientKey]) {
          micronutrientsTotals[nutrientKey] = 0;
        }
        micronutrientsTotals[nutrientKey] +=
          nutrient.value / this.recipeForm.get('servings')?.value!;
      });
    });

    this.recipeNutrients = {
      calories: caloriesTotal,
      macronutrients: setMacronutrients(
        macronutrientsTotals,
        this.userGoal.macronutrients
      ),
      micronutrients: setMicronutrients(
        micronutrientsTotals,
        this.userGoal.micronutrients
      ),
    };

    this.nutrients = {
      calories: caloriesTotal / this.recipeForm.get('servings')?.value!,
      ...macronutrientsTotals,
      ...micronutrientsTotals,
    };
  }

  displayFn(item?: Meal): string {
    return item ? item.name : '';
  }

  triggerFileInput() {
    this.imageInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    const recipeFormValue = this.recipeForm.getRawValue() as Recipe;
    const newRecipe = {
      ...recipeFormValue,
      ingredients: this.selectedIndrigents,
      image: this.selectedFile,
      nutrients: this.nutrients,
    };

    const submit =
      this.mode === AddEdit.ADD
        ? this.recipesService.createRecipe(newRecipe)
        : this.recipesService.updateRecipe(this.recipe._id!, newRecipe)

    submit.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        if (AddEdit.ADD) {
          this.router.navigate(['/recipes', response.data._id]);
        } else {
          this.sidePanelService.closeTopComponent(response.success);
        }
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      },
    });
  }

  addRecipe(): void {
    const recipeFormValue = this.recipeForm.getRawValue() as Recipe;
    const newRecipe = {
      ...recipeFormValue,
      ingredients: this.selectedIndrigents,
      image: this.selectedFile,
      nutrients: this.nutrients,
    };

    this.recipesService.createRecipe(newRecipe).subscribe((response) => {
      this.router.navigate(['/recipes', response.data._id]);
    });
  }

  updateRecipe(): void {
    const recipeFormValue = this.recipeForm.getRawValue() as Recipe;
    const newRecipe = {
      ...recipeFormValue,
      ingredients: this.selectedIndrigents,
      image: this.selectedFile ?? null,
      nutrients: this.nutrients,
    };

    this.recipesService
      .updateRecipe(this.recipe._id!, newRecipe)
      .subscribe((response) => {
        this.sidePanelService.closeTopComponent(response.success);
      });
  }

  goBack(): void {
    this.sidePanelService.closeTopComponent();
  }
}
