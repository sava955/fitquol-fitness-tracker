import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { FormComponent } from '../../../../shared/components/form/form.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ActionButtons } from '../../../../core/models/action.buttons.interface';
import { AddEdit } from '../../../../core/enums/add-edit.enum';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { MealsService } from '../../../diary/services/meals/meals.service';
import { Meal } from '../../../diary/models/meal.interface';
import { MatCardModule } from '@angular/material/card';
import { NutrientsComponent } from '../../../../shared/components/nutrients/nutrients.component';
import { calculateNutritientsForQuantity } from '../../../../core/utils/calculate-nutrients-for-quantity';
import { setMacronutrients } from '../../../../core/utils/calculate-macronutrients';
import { setMicronutrients } from '../../../../core/utils/calculate-micronutrients';
import { GoalsService } from '../../../../core/services/goals/goals.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RecipesService } from '../../services/recipes.service';
import { RecipeCategoriesService } from '../../../../core/services/recipe-categories/recipe-categories.service';
import { mealTypes } from '../../../diary/const/meal-types.const';
import { Router } from '@angular/router';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { AutocompleteComponent } from '../../../../shared/components/autocomplete/autocomplete.component';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea.component';
import { ImageBoxComponent } from '../image-box/image-box.component';
import {
  Macronutrients,
  Micronutrients,
  Nutrients,
  PlainNutrients,
} from '../../../../core/models/nutrient.interface';
import { Goal } from '../../../../core/models/goal';
import { FormBaseComponent } from '../../../../shared/components/form-base/form-base.component';
import { ResponseObj } from '../../../../core/models/http-response.interface';
import { Recipe, RecipeCategory } from '../../models/recipe.interface';

@Component({
  selector: 'app-add-edit-recipe',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageTitleComponent,
    FormComponent,
    InputComponent,
    MatButtonModule,
    MatIcon,
    MatCardModule,
    NutrientsComponent,
    SelectComponent,
    AutocompleteComponent,
    TextareaComponent,
    SelectComponent,
    ImageBoxComponent,
  ],
  templateUrl: './add-edit-recipe.component.html',
  styleUrl: './add-edit-recipe.component.scss',
})
export class AddEditRecipeComponent extends FormBaseComponent<Recipe> {
  private readonly mealsService = inject(MealsService);
  private readonly goalsService = inject(GoalsService);
  private readonly recipesService = inject(RecipesService);
  private readonly recepeCategories = inject(RecipeCategoriesService);
  private readonly router = inject(Router);

  pageTitle!: string;

  get ingredients(): FormArray {
    return this.formGroup.get('ingredients') as FormArray;
  }

  get instructions(): FormArray {
    return this.formGroup.get('instructions') as FormArray;
  }

  userGoal!: Goal;
  recipe!: Recipe;

  mealOptions = mealTypes;

  filteredCategories!: Observable<RecipeCategory[]>;

  filteredOptions!: Observable<Meal[]>[];

  selectedIndrigents: Meal[] = [];

  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | string | null = null;

  nutrientsArr: Nutrients[] = [];

  recipeNutrients!: Nutrients;

  nutrients!: PlainNutrients;

  imageErrorMessage!: string;

  protected override setActionButtons(): ActionButtons[] {
    return [
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
          this.onSubmit();
        },
      },
    ];
  }

  protected override buildForm(): void {
    this.formGroup = this.fb.group({
      image: [''],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(400)]],
      preparationTime: [0, [Validators.required, Validators.min(1)]],
      cookingTime: [0, [Validators.required, Validators.min(1)]],
      servings: [1, [Validators.required, Validators.min(1)]],
      mealType: ['', Validators.required],
      category: ['', Validators.required],
      ingredients: this.fb.array([]),
      instructions: this.fb.array([]),
    });

    if (this.mode === AddEdit.ADD) {
      this.addIngredient();
      this.addInstruction();
    }

    this.goalsService
      .getOne({}, 'current-goal')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        this.userGoal = response.data;

        if (this.mode === AddEdit.EDIT) {
          this.setFormData();
        }
      });
  }

  protected override onFormEvent(): void {
    this.filteredCategories = this.formGroup.get('category')?.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap((value) => {
        if (!value) {
          return of([]);
        }
        return this.searchCategories(value);
      })
    )!;

    this.formGroup
      .get('servings')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((_) => {
        this.ingredients.controls.forEach((control, index) => {
          const quantity = control.get('quantity')?.value!;

          this.calculateNutrients(quantity, index);
        });
      });

    this.setupIngredientAutocomplete();
  }

  protected override getSubmitMethod(
    data: Recipe,
    id?: string
  ): Observable<ResponseObj<Recipe>> {
    if (this.mode === AddEdit.ADD) {
      return this.recipesService.saveWithFile(data);
    }

    return this.recipesService.updateWithFile(id!, data);
  }

  protected override onSubmit(): void {
    const formGroupValue = this.formGroup.getRawValue() as Recipe;
    const newRecipe = {
      ...formGroupValue,
      ingredients: this.selectedIndrigents,
      image: this.selectedFile,
      nutrients: this.nutrients,
    };

    if (!newRecipe.image) {
      this.imageErrorMessage = 'This field is required';
    }

    this.submit(newRecipe, this.recipe?._id);
  }

  protected override onSuccess(response: ResponseObj<Recipe>): void {
    if (this.mode === AddEdit.ADD) {
      this.router.navigate(['/recipes', response.data._id]);
    } else {
      this.sidePanelService.closeTopComponent(response.success);
    }
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
    this.formGroup.patchValue({
      name: this.recipe.name,
      description: this.recipe.description,
      category: this.recipe.category,
      mealType: this.recipe.mealType,
      preparationTime: this.recipe.preparationTime,
      cookingTime: this.recipe.cookingTime,
      servings: this.recipe.servings,
    });

    this.previewUrl =
      typeof this.recipe.image === 'string' ? this.recipe.image : null;

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

  searchCategories(query: string): Observable<RecipeCategory[]> {
    if (!query || query.length < 2) {
      return of([]);
    }
    return this.recepeCategories
      .getAll({ name: query })
      .pipe(map((response) => response.data || []));
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
    }

    return this.mealsService
      .getAll({ food: query })
      .pipe(map((response) => response.data || []));
  }

  validateMealSelection(index: number) {
    const control = this.ingredients.at(index).get('name');
    if (typeof control?.value !== 'object' || !control.value?._id) {
      control?.setValue(null);
      control?.markAsTouched();
      
      this.removeIngredientsFromArray(index);
    }
  }

  addIngredient(): void {
    this.ingredients.push(this.createIngredient());
    this.setupIngredientAutocomplete();
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
    this.filteredOptions.splice(index, 1);
    
    this.removeIngredientsFromArray(index);
  }

  removeIngredientsFromArray(index: number): void {
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

  addIngredientData(event: Meal, i: number): void {
    this.selectedIndrigents[i] = event;
    const name = this.ingredients.controls[i].get('name');
    const quantity = this.ingredients.controls[i].get('quantity');

    name?.setValue(event);
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
    const macronutrientsTotals: Macronutrients = {};
    const micronutrientsTotals: Micronutrients = {};

    const servings = this.formGroup.get('servings')?.value ?? 1;

    let caloriesTotal: number = 0;

    this.nutrientsArr.forEach((item) => {
      caloriesTotal += item.calories;

      item.macronutrients.forEach((nutrient) => {
        const nutrientKey = nutrient.key as keyof Macronutrients;

        macronutrientsTotals[nutrientKey] ??= 0;
        macronutrientsTotals[nutrientKey] += nutrient.value / servings;
      });

      item.micronutrients.forEach((nutrient) => {
        const nutrientKey = nutrient.key as keyof Micronutrients;

        micronutrientsTotals[nutrientKey] ??= 0;
        micronutrientsTotals[nutrientKey] += nutrient.value / servings;
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
      calories: caloriesTotal / this.formGroup.get('servings')?.value!,
      ...macronutrientsTotals,
      ...micronutrientsTotals,
    };
  }

  triggerFileInput() {
    this.imageInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ];
      if (!allowedTypes.includes(file.type)) {
        this.imageErrorMessage = 'Only JPG, PNG, or WEBP files are allowed.';
        return;
      }

      const maxSize = 4 * 1024 * 1024;

      if (file.size > maxSize) {
        this.imageErrorMessage = 'File is too large. Maximum size is 4 MB.';
        return;
      }

      this.imageErrorMessage = '';

      this.selectedFile = file;
      this.loadPreview(file);
    }
  }

  private loadPreview(file: File): void {
    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result);
    reader.readAsDataURL(file);
  }
}
