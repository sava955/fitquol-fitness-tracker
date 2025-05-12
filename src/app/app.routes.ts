import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main/main.component').then(
        (c) => c.MainComponent
      ),
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'diary',
        loadComponent: () =>
          import('./features/diary/diary.component').then(
            (c) => c.DiaryComponent
          ),
      },
      {
        path: 'recipes',
        loadComponent: () =>
          import('./features/recipes/recipes.component').then(
            (c) => c.RecipesComponent
          ),
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/recipes/components/recipes-list/recipes-list.component'
              ).then((c) => c.RecipesListComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import(
                './features/recipes/components/recipe-details/recipe-details.component'
              ).then((c) => c.RecipeDetailsComponent),
          },
        ],
      },
      {
        path: 'user',
        loadComponent: () =>
          import('./features/user/user.component').then((c) => c.UserComponent),
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/user/components/user-profile/user-profile.component'
              ).then((c) => c.UserProfileComponent),
          },
          {
            path: 'edit',
            loadComponent: () =>
              import('./features/user/components/edit-user/edit-user.component').then(
                (c) => c.EditUserComponent
              ),
          },
        ],
      },
    ],
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./layouts/auth/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./layouts/auth/register/register.component').then(
        (c) => c.RegisterComponent
      ),
  },
  { path: '', redirectTo: '/', pathMatch: 'full' },
];
