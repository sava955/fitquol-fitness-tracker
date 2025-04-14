import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { UserService } from '../../../core/services/users/user.service';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { UserGoalsFormComponent } from '../../../shared/components/user-goals-form/user-goals-form.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  PasswordRequest,
  User,
  UserData,
  UserGoals,
} from '../../../core/models/user/user.interface';
import { UserDataFormComponent } from '../../../shared/components/user-data-form/user-data-form.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { Goal } from '../../../core/models/goals/goal';

@Component({
  selector: 'app-edit-user',
  imports: [
    PageTitleComponent,
    MatTabsModule,
    UserGoalsFormComponent,
    UserDataFormComponent,
    ChangePasswordComponent,
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
})
export class EditUserComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  user!: User;
  goals!: Goal[];

  ngOnInit(): void {
    this.userService
      .getAuthenticatedUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        if (response) {
          this.user = response;

          this.goals = this.user.goals;
        }
      });
  }

  goBack(): void {
    this.router.navigateByUrl('user');
  }

  updateUserGoals(data: UserGoals): void {
    this.updateUser(data);
  }

  updateUserData(data: UserData): void {
    const userData = {
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      email: data.email,
    };

    this.updateUser(userData);
  }

  updateUser(data: UserData | UserGoals): void {
    this.userService
      .updateUser(this.user._id!, data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.userService.setAuthenticatedUser(response.data);
          this.router.navigateByUrl('user');
        },
        error: (err) => {
          // this.errorMessage = err.error.message;
        },
      });
  }

  updateUserPassword(data: PasswordRequest): void {
    this.userService
      .updatePassword(this.user._id!, data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.authService.logout();
          this.onConfirmationPopup(res.message);
        },
        error: (err) => {
          // this.errorMessage = err.error.message;
        },
      });
  }

  onConfirmationPopup(message: string): void {
    this.dialog.open(DialogComponent, {
      data: {
        title: message,
        message: 'Sign in with new password',
        closeBtnLabel: 'Dismiss',
      },
      width: '500px',
    });
  }
}
