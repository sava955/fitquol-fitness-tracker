import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Goal } from '../../../core/models/goal';
import { HttpBaseService } from '../http-base.service';

@Injectable({
  providedIn: 'root',
})
export class GoalsService extends HttpBaseService<Goal> {
  protected override getHost(): string {
    return environment.beUrl;
  }

  protected override getBaseResourceEndpoint(): string {
    return '/api/goals';
  }
}
