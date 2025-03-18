import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loggedData = localStorage.getItem('access_token');

  if (loggedData !== null) {
    return true;
  } else {
    debugger;
    router.navigateByUrl('login');
    return false;
  }
};
