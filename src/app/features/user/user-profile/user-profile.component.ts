import {
  Component,
  DestroyRef,
  inject,
  OnInit
} from '@angular/core';
import { UserService } from '../../../core/services/users/user.service';
import { User } from '../../../core/models/user/user.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { LocalSpinnerService } from '../../../shared/services/local-spinner/local-spinner.service';
import { withLocalAppSpinner } from '../../../shared/utils/with-local-spinner';
import { LocalSpinnerComponent } from '../../../shared/components/local-spinner/local-spinner.component';
import { NutrientData, PlainNutrients } from '../../../core/models/nutrients/nutrient.interface';
import { setMacronutrients } from '../../../shared/utils/calculate-macronutrients';
import { setMicronutrients } from '../../../shared/utils/calculate-micronutrients';
import { UserDataComponent } from '../../../shared/components/user-data/user-data.component';
import { WeightChartComponent } from '../../../shared/components/weight-chart/weight-chart.component';

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
    WeightChartComponent
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

          this.macronutrients = setMacronutrients(
            this.user.goals[this.user.goals.length - 1].macronutrients,
            this.user.goals[this.user.goals.length - 1].macronutrients
          );
          this.micronutrients = setMicronutrients(
            this.user.goals[this.user.goals.length - 1].micronutrients,
            this.user.goals[this.user.goals.length - 1].micronutrients
          );
        }
      });
  }
}
