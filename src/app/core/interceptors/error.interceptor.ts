import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = "Une erreur inattendue s'est produite";

      console.error('Erreur HTTP interceptée:', error);

      switch (error.status) {
        case 0:
          errorMessage =
            'Impossible de contacter le serveur. Vérifiez votre connexion internet.';
          break;
        case 400:
          errorMessage = error.error?.message || 'Données de requête invalides';
          break;
        case 401:
          errorMessage = 'Session expirée. Veuillez vous reconnecter.';
          authService.logout().then(() => {
            router.navigate(['/auth/login'], {
              queryParams: { returnUrl: router.url, reason: 'session_expired' },
            });
          });
          break;
        case 403:
          errorMessage =
            "Vous n'avez pas les droits pour effectuer cette action.";
          router.navigate(['/dashboard']);
          break;
        case 404:
          errorMessage = error.error?.message || 'Ressource non trouvée';
          break;
        case 409:
          errorMessage =
            error.error?.message ||
            "Un conflit s'est produit (ressource déjà utilisée)";
          break;
        case 422:
          errorMessage =
            error.error?.message ||
            'Les données fournies ne peuvent pas être traitées';
          break;
        case 429:
          errorMessage =
            'Trop de tentatives. Veuillez patienter avant de réessayer.';
          break;
        case 500:
          errorMessage =
            'Erreur interne du serveur. Veuillez réessayer plus tard.';
          break;
        case 502:
        case 503:
        case 504:
          errorMessage =
            'Service temporairement indisponible. Veuillez réessayer plus tard.';
          break;

        default:
          errorMessage =
            error.error?.message ||
            `Erreur ${error.status}: ${error.statusText}`;
      }

      const enrichedError = {
        ...error,
        userMessage: errorMessage,
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
      };

      return throwError(() => enrichedError);
    }),
  );
};
