import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService)
  const router = inject(Router);
  if (authService.isAuth()) {
    return true
  } else {
    router.navigateByUrl('/login')
    return false
  }


};
