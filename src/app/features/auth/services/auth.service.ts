import { Injectable, signal } from '@angular/core';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users = signal<User[]>([
    {
      id: 1,
      email: 'admin@doctolib.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'System',
      phone: '+33123456789',
      role: 'admin',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 2,
      email: 'dr.martin@doctolib.com',
      password: 'doctor123',
      firstName: 'Dr. Jean',
      lastName: 'Martin',
      phone: '+33123456790',
      role: 'doctor',
      isActive: true,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    {
      id: 3,
      email: 'patient@doctolib.com',
      password: 'patient123',
      firstName: 'Marie',
      lastName: 'Dubois',
      phone: '+33123456791',
      role: 'patient',
      isActive: true,
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    },
  ]);

  private currentUser = signal<User | null>(null);

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  constructor() {
    this.loadUsersFromStorage();
    this.loadUserFromStorage();
  }

  private loadUsersFromStorage() {
    try {
      const savedUsers = localStorage.getItem('doctolib_users');
      if (savedUsers) {
        const users = JSON.parse(savedUsers);
        this.users.set(users);
      }
    } catch (error) {
      console.error(
        'Erreur lors du chargement des utilisateurs depuis localStorage:',
        error,
      );
      localStorage.removeItem('doctolib_users');
    }
  }

  private loadUserFromStorage() {
    try {
      const savedUser = localStorage.getItem('doctolib_currentUser');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        this.currentUser.set(user);
      }
    } catch (error) {
      console.error(
        "Erreur lors du chargement de l'utilisateur depuis localStorage:",
        error,
      );
      localStorage.removeItem('doctolib_currentUser');
    }
  }

  private saveUsersToStorage() {
    try {
      localStorage.setItem('doctolib_users', JSON.stringify(this.users()));
    } catch (error) {
      console.error(
        'Erreur lors de la sauvegarde des utilisateurs dans localStorage:',
        error,
      );
    }
  }

  private saveUserToStorage(user: User | null) {
    try {
      if (user) {
        localStorage.setItem('doctolib_currentUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('doctolib_currentUser');
      }
    } catch (error) {
      console.error(
        "Erreur lors de la sauvegarde de l'utilisateur dans localStorage:",
        error,
      );
    }
  }

  async login(
    credentials: LoginRequest,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    await this.delay(500);

    const user = this.users().find(
      (u) =>
        u.email === credentials.email &&
        u.password === credentials.password &&
        u.isActive,
    );

    if (user) {
      this.currentUser.set(user);
      this.saveUserToStorage(user);
      return { success: true, user };
    } else {
      return { success: false, error: 'Email ou mot de passe incorrect' };
    }
  }

  async register(
    userData: RegisterRequest,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    await this.delay(600);

    if (this.users().some((u) => u.email === userData.email)) {
      return { success: false, error: 'Cet email est déjà utilisé' };
    }

    if (userData.password !== userData.confirmPassword) {
      return {
        success: false,
        error: 'Les mots de passe ne correspondent pas',
      };
    }

    const newUser: User = {
      id: Date.now(),
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      role: userData.role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.update((users) => [...users, newUser]);
    this.currentUser.set(newUser);
    this.saveUsersToStorage();
    this.saveUserToStorage(newUser);

    return { success: true, user: newUser };
  }

  async logout(): Promise<void> {
    await this.delay(200);
    this.currentUser.set(null);
    this.saveUserToStorage(null);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  get currentUserSignal() {
    return this.currentUser;
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  isDoctor(): boolean {
    return this.currentUser()?.role === 'doctor';
  }

  isPatient(): boolean {
    return this.currentUser()?.role === 'patient';
  }

  async getAllUsers(): Promise<User[]> {
    await this.delay(400);

    if (!this.isAdmin()) {
      throw new Error('Accès non autorisé');
    }

    return this.users().map((user) => ({
      ...user,
      password: '***',
    }));
  }

  async updateProfile(profileData: Partial<User>): Promise<User | null> {
    await this.delay(300);

    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Utilisateur non connecté');
    }

    const updatedUser = {
      ...currentUser,
      ...profileData,
      updatedAt: new Date(),
    };

    this.users.update((users) =>
      users.map((user) => (user.id === currentUser.id ? updatedUser : user)),
    );

    this.currentUser.set(updatedUser);
    this.saveUsersToStorage();
    this.saveUserToStorage(updatedUser);

    return updatedUser;
  }

  getToken(): string | null {
    const user = this.currentUser();
    return user ? `mock-token-${user.id}-${Date.now()}` : null;
  }
}
