import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ExercisesComponent } from './features/exercises/exercises.component';
import { AddExerciseComponent } from './features/exercises/add-exercise/add-exercise.component';
import { LoginComponent } from './layouts/auth-layout/login/login.component';
import { RegisterComponent } from './layouts/auth-layout/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { MealsComponent } from './features/meals/meals.component';
import { DiaryComponent } from './features/diary/diary.component';
import { AddEditMealComponent } from './features/meals/add-edit-meal/add-edit-meal.component';
import { RecipesComponent } from './features/recipes/recipes.component';
import { RecipesListComponent } from './features/recipes/recipes-list/recipes-list.component';
import { RepiceDetailsComponent } from './features/recipes/repice-details/repice-details.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(
        (c) => c.MainLayoutComponent
      ),
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'diary', component: DiaryComponent },
      { path: 'recipes', component: RecipesComponent, children: [
        { path: '', component: RecipesListComponent },
        { path: ':id', component: RepiceDetailsComponent }
      ] },
      {
        path: 'exercises',
        component: ExercisesComponent,
        children: [
          { path: 'add-exercise/:id', component: AddExerciseComponent },
        ],
      },
      {
        path: 'nutrition',
        component: MealsComponent,
        children: [
          { path: 'add-meal/:id', component: AddEditMealComponent },
        ],
      },
    ],
    canActivate: [authGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' },
];
