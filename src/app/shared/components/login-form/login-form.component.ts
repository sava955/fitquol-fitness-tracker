import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormComponent } from '../form/form.component';
import { InputComponent } from '../input/input.component';
import { LogoComponent } from '../logo/logo.component';
import { FormBaseComponent } from '../form-base/form-base.component';
import { LoginParams } from '../../../core/models/auth';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { ActionButtons } from '../../../core/models/action.buttons.interface';
import { loginActionButtons } from '../../../core/const/auth.const';
import { map, Observable } from 'rxjs';
import { ResponseObj } from '../../../core/models/http-response.interface';

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FormComponent,
    InputComponent,
    LogoComponent,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent extends FormBaseComponent<LoginParams | string> {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @Output() onLoggedIn = new EventEmitter<string | null>();
  @Output() onSignUp = new EventEmitter();

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

    this.onLoggedIn.emit(response.data);
  }

  private navigateToRegister(): void {
    this.router.navigateByUrl('register');

    this.onSignUp.emit();
  }
}
