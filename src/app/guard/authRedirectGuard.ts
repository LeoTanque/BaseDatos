import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const authRedirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (authService.isAuth()) {
    console.log('Usuario autenticado, redirigiendo al home');
    router.navigateByUrl('/home');
    return false; // Bloquear acceso al login
  } else {
    console.log('Usuario no autenticado, permitiendo acceso al login');
    return true; // Permitir acceso al login
  }
};
