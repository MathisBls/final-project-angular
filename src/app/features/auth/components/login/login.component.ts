import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full space-y-8">
        <div>
          <div
            class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100"
          >
            <svg
              class="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          </div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion à votre compte
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Accédez à votre espace personnel
          </p>
        </div>

        <form
          [formGroup]="loginForm"
          (ngSubmit)="onSubmit()"
          class="mt-8 space-y-6"
        >
          @if (errorMessage()) {
            <div
              class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm"
            >
              {{ errorMessage() }}
            </div>
          }

          <div class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700"
                >Adresse email</label
              >
              <input
                id="email"
                type="email"
                formControlName="email"
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="votre@email.com"
                [class.border-red-300]="
                  loginForm.get('email')?.invalid &&
                  loginForm.get('email')?.touched
                "
              />
              @if (
                loginForm.get('email')?.invalid &&
                loginForm.get('email')?.touched
              ) {
                <p class="mt-1 text-sm text-red-600">
                  Veuillez entrer une adresse email valide
                </p>
              }
            </div>

            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700"
                >Mot de passe</label
              >
              <input
                id="password"
                type="password"
                formControlName="password"
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Votre mot de passe"
                [class.border-red-300]="
                  loginForm.get('password')?.invalid &&
                  loginForm.get('password')?.touched
                "
              />
              @if (
                loginForm.get('password')?.invalid &&
                loginForm.get('password')?.touched
              ) {
                <p class="mt-1 text-sm text-red-600">
                  Le mot de passe est requis
                </p>
              }
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
                Mot de passe oublié ?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading()"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (isLoading()) {
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Connexion en cours...
              } @else {
                Se connecter
              }
            </button>
          </div>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              Pas encore de compte ?
              <a
                routerLink="/auth/register"
                class="font-medium text-blue-600 hover:text-blue-500"
              >
                Créer un compte
              </a>
            </p>
          </div>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-gray-50 text-gray-500"
                  >Comptes de démonstration</span
                >
              </div>
            </div>
            <div class="mt-4 grid grid-cols-1 gap-3">
              <button
                type="button"
                (click)="loginAs('patient')"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Patient (patient&#64;doctolib.com)
              </button>
              <button
                type="button"
                (click)="loginAs('doctor')"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Médecin (dr.martin&#64;doctolib.com)
              </button>
              <button
                type="button"
                (click)="loginAs('admin')"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Admin (admin&#64;doctolib.com)
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      try {
        const result = await this.authService.login(this.loginForm.value);

        if (result.success && result.user) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set(result.error || 'Erreur de connexion');
        }
      } catch {
        this.errorMessage.set('Erreur de connexion');
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  async loginAs(role: string) {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const credentials = {
      patient: { email: 'patient@doctolib.com', password: 'patient123' },
      doctor: { email: 'dr.martin@doctolib.com', password: 'doctor123' },
      admin: { email: 'admin@doctolib.com', password: 'admin123' },
    };

    try {
      const result = await this.authService.login(
        credentials[role as keyof typeof credentials],
      );

      if (result.success && result.user) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage.set('Erreur de connexion');
      }
    } catch {
      this.errorMessage.set('Erreur de connexion');
    } finally {
      this.isLoading.set(false);
    }
  }
}
