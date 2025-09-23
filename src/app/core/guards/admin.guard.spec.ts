import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { adminGuard } from './admin.guard';
import { AuthService } from '../../features/auth/services/auth.service';

describe('AdminGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAdmin']);
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

  it('should allow access when user is admin', () => {
    authServiceSpy.isAdmin.and.returnValue(true);

    const result = adminGuard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot,
    );

    expect(result).toBe(true);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to dashboard when user is not admin', () => {
    authServiceSpy.isAdmin.and.returnValue(false);

    const result = adminGuard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot,
    );

    expect(result).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should redirect to dashboard when user is doctor', () => {
    authServiceSpy.isAdmin.and.returnValue(false);

    const result = adminGuard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot,
    );

    expect(result).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should redirect to dashboard when user is patient', () => {
    authServiceSpy.isAdmin.and.returnValue(false);

    const result = adminGuard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot,
    );

    expect(result).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
