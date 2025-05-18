import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpBaseService } from '../../../core/services/http-base.service';
import { CaloriesStatistic, Dashboard, ExercisesStatistic } from '../models/dashboard.interface';
import { Goal } from '../../../core/models/goal';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends HttpBaseService<Dashboard | CaloriesStatistic | Goal | ExercisesStatistic> {
  startDate = signal<Date>(new Date());

  protected override getHost(): string {
    return environment.beUrl;
  }

  protected override getBaseResourceEndpoint(): string {
    return '/api/dashboard';
  }
}
