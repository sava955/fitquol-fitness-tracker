import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
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
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { formatDate } from '@angular/common';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

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
    CanvasJSAngularChartsModule,
    NgApexchartsModule,
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

  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [],
      chart: {
        height: 300,
        type: 'area',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {},
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    };
  }

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

          this.chartOptions.series = [
            {
              name: 'Weight progress',
              data: this.user.goals
                .map((goal) => {
                  return goal.weight;
                }),
            },
          ];

          if (this.chartOptions.xaxis)
            this.chartOptions.xaxis.categories = this.user.goals
              .map((goal) => {
                return formatDate(goal.fromDate, 'dd/MM/yyyy', 'en-US');
              });
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
