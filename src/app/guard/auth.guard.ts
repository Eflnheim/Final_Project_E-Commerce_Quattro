import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanMatchFn = async (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = await authService.isLoggedIn();

  if(isLoggedIn) {
    return true;
  } else {
    router.navigateByUrl('/sign-in', {replaceUrl : true});
    return false
  }
};
