import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { User } from '../../models/user.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { LocalSpinnerService } from '../../../../core/services/local-spinner/local-spinner.service';
import { withLocalAppSpinner } from '../../../../core/utils/with-local-spinner';
import { LocalSpinnerComponent } from '../../../../shared/components/local-spinner/local-spinner.component';
import {
  NutrientData,
  PlainNutrients,
} from '../../../../core/models/nutrient.interface';
import { setMacronutrients } from '../../../../core/utils/calculate-macronutrients';
import { setMicronutrients } from '../../../../core/utils/calculate-micronutrients';
import { UserDataComponent } from '../../../../shared/components/user-data/user-data.component';
import { WeightChartComponent } from '../../../../shared/components/weight-chart/weight-chart.component';
import { Goal } from '../../../../core/models/goal';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  imports: [
    PageTitleComponent,
    MatCardModule,
    MatButtonModule,
    MatIcon,
    RouterLink,
    LocalSpinnerComponent,
    UserDataComponent,
    WeightChartComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly spinnerService = inject(LocalSpinnerService);

  user!: User;
  nutrients!: PlainNutrients;
  goal!: Goal;

  macronutrients: NutrientData[] = [];
  micronutrients: NutrientData[] = [];

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.userService
      .getAuthenticatedUser()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        withLocalAppSpinner(this.spinnerService)
      )
      .subscribe((response) => {
        if (response) {
          this.user = response;
          this.goal = this.user.goals[0];

          if (this.user.goals) {
            this.macronutrients = setMacronutrients(
              this.goal.macronutrients,
              this.goal.macronutrients
            );
            this.micronutrients = setMicronutrients(
              this.goal.micronutrients,
              this.goal.micronutrients
            );
          }
        }
      });
  }
}
