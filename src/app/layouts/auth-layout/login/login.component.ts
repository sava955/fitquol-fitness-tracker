import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { FormBaseComponent } from '../../../shared/components/form-base/form-base.component';
import { InputBaseComponent } from '../../../shared/components/input-base/input-base.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SpinnerService } from '../../../shared/services/spinner/spinner-service.service';
import { ActionButtons } from '../../../core/models/action-buttons/action.buttons.interface';
import { withGlobalAppSpinner } from '../../../shared/utils/with-global-spinner';
import { ResponseObj } from '../../../core/models/http-response/http-response.interface';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FormBaseComponent,
    InputBaseComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly spinnerService = inject(SpinnerService);

  loginForm = this.fb.group({
    email: [null, Validators.required],
    password: [null, Validators.required],
  });

  errorMessage!: string;

  actionBtns: ActionButtons[] = [
    { label: 'Sign up', action: () => {this.router.navigateByUrl('register')}, style: 'secondary',},
    { label: 'Sign in', action: () => {this.login()}}
  ]

  get email() {
    return this.loginForm.get('email');
  } 

  get password() {
    return this.loginForm.get('password');
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const formData = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    };
    
    this.authService.login(formData).pipe(withGlobalAppSpinner(
          this.spinnerService,
          'Signing in a user...',
        )).subscribe({
      next: (response: ResponseObj<string>) => {
        this.authService.setToken(response.data);
        this.router.navigateByUrl('');
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      }
    });
  }
}
