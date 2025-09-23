import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const currentUser = authService.getCurrentUser();

  const requiresAuth =
    req.url.includes('/api/') || req.headers.has('Authorization');

  if (requiresAuth && currentUser) {
    const token = btoa(
      JSON.stringify({
        userId: currentUser.id,
        email: currentUser.email,
        role: currentUser.role,
        exp: Date.now() + 3600000,
      }),
    );

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-User-Role': currentUser.role,
        'X-User-ID': currentUser.id.toString(),
      },
    });

    return next(authReq);
  }
  return next(req);
};
