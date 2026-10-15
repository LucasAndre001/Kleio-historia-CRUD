import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  // Devolver uma UrlTree faz o router redirecionar sozinho.
  return auth.isAutenticado() ? true : router.createUrlTree(['/admin/login']);
};
