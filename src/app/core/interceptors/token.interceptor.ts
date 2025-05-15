import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, switchMap, take, throwError } from 'rxjs';
import { LoginPopupComponent } from '../../shared/components/login-popup/login-popup.component';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  const dialog = inject(MatDialog);

  const clonedRequest = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(clonedRequest).pipe(
    catchError(err => {
      if (err.status === 401 || err.status === 403) {
        localStorage.removeItem('access_token');

        const dialogRef = dialog.open(
          LoginPopupComponent,
          {
            width: '500px',
            disableClose: true,
          }
        );
        
        return dialogRef.afterClosed().pipe(
          take(1),
          switchMap(result => {
            if (result?.token) {
              localStorage.setItem('access_token', result.token);
              const retriedRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${result.token}`
                }
              });
              return next(retriedRequest);
            } else {
              return throwError(() => err);
            }
          })
        );
      }

      return throwError(() => err);
    })
  );
};