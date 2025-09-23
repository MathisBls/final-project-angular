import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { DoctorService } from '../../doctors/services/doctor.service';
import { Doctor } from '../../doctors/models/doctor.model';

describe('AuthService', () => {
  let service: AuthService;
  let doctorServiceSpy: jasmine.SpyObj<DoctorService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('DoctorService', ['createDoctor']);

    TestBed.configureTestingModule({
      providers: [AuthService, { provide: DoctorService, useValue: spy }],
    });

    service = TestBed.inject(AuthService);
    doctorServiceSpy = TestBed.inject(
      DoctorService,
    ) as jasmine.SpyObj<DoctorService>;

    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login with valid credentials', async () => {
    const credentials = {
      email: 'admin@doctolib.com',
      password: 'admin123',
    };

    const result = await service.login(credentials);

    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user?.email).toBe('admin@doctolib.com');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should reject login with invalid credentials', async () => {
    const credentials = {
      email: 'invalid@email.com',
      password: 'wrongpassword',
    };

    const result = await service.login(credentials);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Email ou mot de passe incorrect');
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should register a new user', async () => {
    const userData = {
      email: 'newuser@test.com',
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+33123456789',
      role: 'patient' as const,
    };

    const result = await service.register(userData);

    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user?.email).toBe('newuser@test.com');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should reject registration with existing email', async () => {
    const userData = {
      email: 'admin@doctolib.com',
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+33123456789',
      role: 'patient' as const,
    };

    const result = await service.register(userData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Cet email est déjà utilisé');
  });

  it('should reject registration with mismatched passwords', async () => {
    const userData = {
      email: 'newuser@test.com',
      password: 'password123',
      confirmPassword: 'differentpassword',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+33123456789',
      role: 'patient' as const,
    };

    const result = await service.register(userData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Les mots de passe ne correspondent pas');
  });

  it('should logout user', async () => {
    const credentials = {
      email: 'admin@doctolib.com',
      password: 'admin123',
    };

    await service.login(credentials);
    expect(service.isAuthenticated()).toBe(true);

    await service.logout();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should check user roles correctly', async () => {
    const adminCredentials = {
      email: 'admin@doctolib.com',
      password: 'admin123',
    };

    await service.login(adminCredentials);

    expect(service.isAdmin()).toBe(true);
    expect(service.isDoctor()).toBe(false);
    expect(service.isPatient()).toBe(false);
  });

  it('should create doctor profile when registering as doctor', async () => {
    const userData = {
      email: 'newdoctor@test.com',
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'Dr. Jane',
      lastName: 'Smith',
      phone: '+33123456789',
      role: 'doctor' as const,
    };

    doctorServiceSpy.createDoctor.and.returnValue(
      Promise.resolve({} as Doctor),
    );

    const result = await service.register(userData);

    expect(result.success).toBe(true);
    expect(doctorServiceSpy.createDoctor).toHaveBeenCalled();
  });

  it('should persist user data in localStorage', async () => {
    const credentials = {
      email: 'admin@doctolib.com',
      password: 'admin123',
    };

    await service.login(credentials);

    const savedUser = localStorage.getItem('doctolib_currentUser');
    expect(savedUser).toBeTruthy();

    const user = JSON.parse(savedUser!);
    expect(user.email).toBe('admin@doctolib.com');
  });

  it('should load user from localStorage on initialization', () => {
    const user = {
      id: 1,
      email: 'test@test.com',
      password: 'password',
      firstName: 'Test',
      lastName: 'User',
      phone: '+33123456789',
      role: 'patient' as const,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    localStorage.setItem('doctolib_currentUser', JSON.stringify(user));

    const newService = TestBed.inject(AuthService);
    expect(newService.isAuthenticated()).toBe(true);
    expect(newService.getCurrentUser()?.email).toBe('test@test.com');
  });
});
