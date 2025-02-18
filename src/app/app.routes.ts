import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ExercisesComponent } from './features/exercises/exercises.component';
import { AddExerciseComponent } from './features/exercises/add-exercise/add-exercise.component';
import { LoginComponent } from './layouts/auth-layout/login/login.component';
import { RegisterComponent } from './layouts/auth-layout/register/register.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./layouts/main-layout/main-layout.component').then(c => c.MainLayoutComponent), 
        children: [
            { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'exercises', component: ExercisesComponent, children: [
                { path: 'add-exercise/:id', component: AddExerciseComponent }
            ] }
        ], canActivate: [authGuard]
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '',   redirectTo: '/', pathMatch: 'full' }
];
