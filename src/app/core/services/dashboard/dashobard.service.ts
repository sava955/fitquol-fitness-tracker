import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable } from 'rxjs';
import { ResponseObj } from '../../models/http-response/http-response.interface';
import { Dashboard } from '../../models/dashboard/dashboard.interface';

@Injectable({
  providedIn: 'root',
})
export class DashobardService {
  readonly dashboardUrl = environment.beUrl + '/api/dashboard';
  readonly httpClient = inject(HttpClient);
  private readonly _snackBar = inject(MatSnackBar);

  getDashboard(): Observable<Dashboard> {
    return this.httpClient.get<ResponseObj<Dashboard>>(this.dashboardUrl).pipe(
      map((response) => {
        if (!response.success) {
          this._snackBar.open(response.message, 'close');
        }

        return response.data;
      })
    );
  }
}
