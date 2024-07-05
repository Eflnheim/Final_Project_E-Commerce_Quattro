import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { UserDataService } from '../services/userData/user-data.service';

export const profileGuard: CanMatchFn = async (route, segments) => {
  const userDataService = inject(UserDataService);
  const router = inject(Router);

  try {
    const data = await userDataService.isUserDataComplete();
    
    if (data) {
      return true;
    } else {
      router.navigateByUrl('/home', { replaceUrl: true });
      return false;
    }
  } catch (error) {
    console.error('Error in profileGuard:', error);
    router.navigateByUrl('/home', { replaceUrl: true });
    return false;
  }
};
