import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const doctorGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isDoctor() || authService.isAdmin()) {
    return true;
  } else {
    // Rediriger vers le dashboard
    router.navigate(['/dashboard']);
    return false;
  }
};
