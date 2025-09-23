import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { retryWhen, take, concatMap, throwError, timer } from 'rxjs';

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  const maxRetries = 3;
  const retryDelay = 1000;
  const exponentialBackoff = true;

  const shouldRetry = (error: HttpErrorResponse): boolean => {
    if (req.method !== 'GET' && req.method !== 'POST') return false;
    if (req.headers.has('X-No-Retry')) return false;
    if (error.status >= 400 && error.status < 500) return false;
    if (error.status === 401 || error.status === 403) return false;

    return (
      error.status === 0 ||
      error.status >= 500 ||
      error.status === 408 ||
      error.status === 429
    );
  };

  return next(req).pipe(
    retryWhen((errors) =>
      errors.pipe(
        take(maxRetries),
        concatMap((error: HttpErrorResponse, retryAttempt: number) => {
          if (!shouldRetry(error)) {
            return throwError(() => error);
          }

          const delayTime = exponentialBackoff
            ? retryDelay * Math.pow(2, retryAttempt)
            : retryDelay;

          console.log(
            `Retry tentative ${retryAttempt + 1}/${maxRetries} dans ${delayTime}ms pour ${req.url}`,
          );

          return timer(delayTime);
        }),
      ),
    ),
  );
};
