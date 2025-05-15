import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginFormComponent } from '../../../shared/components/login-form/login-form.component';

@Component({
  selector: 'app-login',
  imports: [
    LoginFormComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly router = inject(Router);

  login(): void {
    this.router.navigateByUrl('');
  }
}