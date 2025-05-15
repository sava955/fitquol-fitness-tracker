import { Component, inject } from '@angular/core';
import {
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { LoginFormComponent } from '../login-form/login-form.component';

@Component({
  selector: 'app-login-popup',
  imports: [MatDialogContent, LoginFormComponent],
  templateUrl: './login-popup.component.html',
  styleUrl: './login-popup.component.scss',
})
export class LoginPopupComponent {
  private readonly dialogRef = inject(MatDialogRef<LoginPopupComponent>);

  login(event: string | null): void {
    setTimeout(() => {
      this.dialogRef.close({ token: event });
    }, 0);
  }

  goToSignUp(): void {
    this.dialogRef.close();
  }
}
