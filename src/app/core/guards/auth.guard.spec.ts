import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../../features/auth/services/auth.service';

describe('AuthGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
      ],
    });

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow access when user is authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);

    const result = authGuard(
      {} as ActivatedRouteSnapshot,
      { url: '/dashboard' } as RouterStateSnapshot,
    );

    expect(result).toBe(true);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is not authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);

    const result = authGuard(
      {} as ActivatedRouteSnapshot,
      { url: '/dashboard' } as RouterStateSnapshot,
    );

    expect(result).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login'], {
      queryParams: { returnUrl: '/dashboard' },
    });
  });

  it('should preserve return URL in query params', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);
    const returnUrl = '/admin/doctors';

    authGuard(
      {} as ActivatedRouteSnapshot,
      { url: returnUrl } as RouterStateSnapshot,
    );

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login'], {
      queryParams: { returnUrl },
    });
  });
});
