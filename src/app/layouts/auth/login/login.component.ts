import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { FormComponent } from '../../../shared/components/form/form.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ActionButtons } from '../../../core/models/action.buttons.interface';
import { ResponseObj } from '../../../core/models/http-response.interface';
import { FormBaseComponent } from '../../../shared/components/form-base/form-base.component';
import { LoginParams } from '../../../core/models/auth';
import { map, Observable } from 'rxjs';
import { loginActionButtons } from '../../../core/const/auth.const';
export interface LoginResponse {
  token: string;
}
@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FormComponent,
    InputComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent extends FormBaseComponent<LoginParams | string> {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  get email() {
    return this.formGroup.get('email');
  }

  get password() {
    return this.formGroup.get('password');
  }

  protected override setActionButtons(): ActionButtons[] {
    return loginActionButtons(
      this.navigateToRegister.bind(this),
      this.onSubmit.bind(this)
    );
  }

  protected override buildForm(): void {
    this.formGroup = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  protected override onFormEvent(): void {}

  protected override getSubmitMethod(
    data: LoginParams
  ): Observable<ResponseObj<string>> {
    return this.authService
      .save(data, 'login')
      .pipe(map((response) => response as ResponseObj<string>));
  }

  protected override onSubmit(): void {
    this.submit(this.formGroup.value);
  }

  protected override onSuccess(response: ResponseObj<string>): void {
    this.authService.setToken(response.data);
    this.router.navigateByUrl('');
  }

  private navigateToRegister(): void {
    this.router.navigateByUrl('register');
  }
}
