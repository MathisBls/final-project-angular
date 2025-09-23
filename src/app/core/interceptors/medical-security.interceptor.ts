import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';

export const medicalSecurityInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const currentUser = authService.getCurrentUser();

  const containsSensitiveData =
    req.url.includes('/patients') ||
    req.url.includes('/appointments') ||
    req.url.includes('/medical-records') ||
    req.url.includes('/prescriptions') ||
    (req.body &&
      (JSON.stringify(req.body).includes('symptoms') ||
        JSON.stringify(req.body).includes('prescription') ||
        JSON.stringify(req.body).includes('medicalHistory')));

  if (containsSensitiveData) {
    const secureReq = req.clone({
      setHeaders: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-Medical-Data': 'true',
        'X-GDPR-Compliant': 'true',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      },
    });

    return next(secureReq).pipe(
      tap({
        next: () => {
          console.log(
            `[MEDICAL ACCESS] ${currentUser?.role} ${currentUser?.email} accessed ${req.method} ${req.url}`,
            {
              timestamp: new Date().toISOString(),
              userId: currentUser?.id,
              userRole: currentUser?.role,
              action: `${req.method} ${req.url}`,
              success: true,
            },
          );
        },
        error: (error) => {
          console.warn(
            `[MEDICAL ACCESS DENIED] ${currentUser?.role} ${currentUser?.email} failed to access ${req.method} ${req.url}`,
            {
              timestamp: new Date().toISOString(),
              userId: currentUser?.id,
              userRole: currentUser?.role,
              action: `${req.method} ${req.url}`,
              success: false,
              error: error.status,
            },
          );
        },
      }),
    );
  }

  return next(req);
};
