import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');

    emailControl?.setValue('');
    passwordControl?.setValue('');

    expect(emailControl?.hasError('required')).toBe(true);
    expect(passwordControl?.hasError('required')).toBe(true);
    expect(component.loginForm.invalid).toBe(true);
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.get('email');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBe(false);
  });

  it('should validate password minimum length', () => {
    const passwordControl = component.loginForm.get('password');

    passwordControl?.setValue('123');
    expect(passwordControl?.hasError('minlength')).toBe(true);

    passwordControl?.setValue('123456');
    expect(passwordControl?.hasError('minlength')).toBe(false);
  });

  it('should call authService.login on form submission', async () => {
    authServiceSpy.login.and.returnValue(
      Promise.resolve({
        success: true,
        user: {
          id: 1,
          email: 'test@test.com',
          password: 'password',
          firstName: 'Test',
          lastName: 'User',
          phone: '+33123456789',
          role: 'patient',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }),
    );

    component.loginForm.patchValue({
      email: 'test@test.com',
      password: 'password123',
    });

    await component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123',
    });
  });

  it('should navigate to dashboard on successful login', async () => {
    authServiceSpy.login.and.returnValue(
      Promise.resolve({
        success: true,
        user: {
          id: 1,
          email: 'test@test.com',
          password: 'password',
          firstName: 'Test',
          lastName: 'User',
          phone: '+33123456789',
          role: 'patient',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }),
    );

    component.loginForm.patchValue({
      email: 'test@test.com',
      password: 'password123',
    });

    await component.onSubmit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should display error message on failed login', async () => {
    authServiceSpy.login.and.returnValue(
      Promise.resolve({
        success: false,
        error: 'Email ou mot de passe incorrect',
      }),
    );

    component.loginForm.patchValue({
      email: 'wrong@email.com',
      password: 'wrongpassword',
    });

    await component.onSubmit();

    expect(component.errorMessage()).toBe('Email ou mot de passe incorrect');
  });

  it('should set loading state during login', async () => {
    authServiceSpy.login.and.returnValue(
      new Promise((resolve) => {
        setTimeout(
          () =>
            resolve({
              success: true,
              user: {
                id: 1,
                email: 'test@test.com',
                password: 'password',
                firstName: 'Test',
                lastName: 'User',
                phone: '+33123456789',
                role: 'patient',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            }),
          100,
        );
      }),
    );

    component.loginForm.patchValue({
      email: 'test@test.com',
      password: 'password123',
    });

    const loginPromise = component.onSubmit();

    expect(component.isLoading()).toBe(true);

    await loginPromise;

    expect(component.isLoading()).toBe(false);
  });

  it('should not submit form when invalid', () => {
    component.loginForm.patchValue({
      email: 'invalid-email',
      password: '123',
    });

    component.onSubmit();

    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should provide demo login buttons', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const demoButtons = compiled.querySelectorAll('[data-testid="demo-login"]');

    expect(demoButtons.length).toBeGreaterThan(0);
  });

  it('should call loginAs with correct role', async () => {
    authServiceSpy.login.and.returnValue(
      Promise.resolve({
        success: true,
        user: {
          id: 1,
          email: 'admin@doctolib.com',
          password: 'admin123',
          firstName: 'Admin',
          lastName: 'System',
          phone: '+33123456789',
          role: 'admin',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }),
    );

    await component.loginAs('admin');

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'admin@doctolib.com',
      password: 'admin123',
    });
  });
});
