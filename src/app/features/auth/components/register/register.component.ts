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
import {
  AutoFocusDirective,
  PhoneFormatDirective,
} from '../../../../shared/directives';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    AutoFocusDirective,
    PhoneFormatDirective,
  ],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full space-y-8">
        <div>
          <div
            class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100"
          >
            <svg
              class="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              ></path>
            </svg>
          </div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer votre compte
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Rejoignez la communauté Doctolib
          </p>
        </div>

        <form
          [formGroup]="registerForm"
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

          @if (successMessage()) {
            <div
              class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm"
            >
              {{ successMessage() }}
            </div>
          }

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label
                  for="firstName"
                  class="block text-sm font-medium text-gray-700"
                  >Prénom</label
                >
                <input
                  id="firstName"
                  type="text"
                  formControlName="firstName"
                  [appAutoFocus]="true"
                  class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Prénom"
                  [class.border-red-300]="
                    registerForm.get('firstName')?.invalid &&
                    registerForm.get('firstName')?.touched
                  "
                />
                @if (
                  registerForm.get('firstName')?.invalid &&
                  registerForm.get('firstName')?.touched
                ) {
                  <p class="mt-1 text-sm text-red-600">Le prénom est requis</p>
                }
              </div>
              <div>
                <label
                  for="lastName"
                  class="block text-sm font-medium text-gray-700"
                  >Nom</label
                >
                <input
                  id="lastName"
                  type="text"
                  formControlName="lastName"
                  class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nom"
                  [class.border-red-300]="
                    registerForm.get('lastName')?.invalid &&
                    registerForm.get('lastName')?.touched
                  "
                />
                @if (
                  registerForm.get('lastName')?.invalid &&
                  registerForm.get('lastName')?.touched
                ) {
                  <p class="mt-1 text-sm text-red-600">Le nom est requis</p>
                }
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700"
                >Adresse email</label
              >
              <input
                id="email"
                type="email"
                formControlName="email"
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="votre@email.com"
                [class.border-red-300]="
                  registerForm.get('email')?.invalid &&
                  registerForm.get('email')?.touched
                "
              />
              @if (
                registerForm.get('email')?.invalid &&
                registerForm.get('email')?.touched
              ) {
                <p class="mt-1 text-sm text-red-600">
                  Veuillez entrer une adresse email valide
                </p>
              }
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700"
                >Téléphone</label
              >
              <input
                id="phone"
                type="tel"
                formControlName="phone"
                appPhoneFormat
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="+33 1 23 45 67 89"
                [class.border-red-300]="
                  registerForm.get('phone')?.invalid &&
                  registerForm.get('phone')?.touched
                "
              />
              @if (
                registerForm.get('phone')?.invalid &&
                registerForm.get('phone')?.touched
              ) {
                <p class="mt-1 text-sm text-red-600">
                  Le numéro de téléphone est requis
                </p>
              }
            </div>

            <div>
              <label for="role" class="block text-sm font-medium text-gray-700"
                >Type de compte</label
              >
              <select
                id="role"
                formControlName="role"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="patient">
                  Patient - Prendre des rendez-vous
                </option>
                <option value="doctor">Médecin - Gérer mes patients</option>
              </select>
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
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Minimum 6 caractères"
                [class.border-red-300]="
                  registerForm.get('password')?.invalid &&
                  registerForm.get('password')?.touched
                "
              />
              @if (
                registerForm.get('password')?.invalid &&
                registerForm.get('password')?.touched
              ) {
                <p class="mt-1 text-sm text-red-600">
                  Le mot de passe doit contenir au moins 6 caractères
                </p>
              }
            </div>

            <div>
              <label
                for="confirmPassword"
                class="block text-sm font-medium text-gray-700"
                >Confirmer le mot de passe</label
              >
              <input
                id="confirmPassword"
                type="password"
                formControlName="confirmPassword"
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Confirmer votre mot de passe"
                [class.border-red-300]="
                  registerForm.get('confirmPassword')?.invalid &&
                  registerForm.get('confirmPassword')?.touched
                "
              />
              @if (
                registerForm.get('confirmPassword')?.invalid &&
                registerForm.get('confirmPassword')?.touched
              ) {
                <p class="mt-1 text-sm text-red-600">
                  Les mots de passe ne correspondent pas
                </p>
              }
            </div>
          </div>

          <div class="flex items-center">
            <input
              id="terms"
              type="checkbox"
              formControlName="acceptTerms"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-900">
              J'accepte les
              <a href="#" class="text-blue-600 hover:text-blue-500"
                >conditions d'utilisation</a
              >
              et la
              <a href="#" class="text-blue-600 hover:text-blue-500"
                >politique de confidentialité</a
              >
            </label>
          </div>

          <div>
            <button
              type="submit"
              [disabled]="registerForm.invalid || isLoading()"
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
                Création du compte...
              } @else {
                Créer mon compte
              }
            </button>
          </div>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              Déjà un compte ?
              <a
                routerLink="/auth/login"
                class="font-medium text-blue-600 hover:text-blue-500"
              >
                Se connecter
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [],
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  registerForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor() {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: [
          '',
          [Validators.required, Validators.pattern(/^[+]?[0-9\s\-()]{10,}$/)],
        ],
        role: ['patient', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        acceptTerms: [false, [Validators.requiredTrue]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');

      try {
        const formValue = this.registerForm.value;
        const result = await this.authService.register({
          email: formValue.email,
          password: formValue.password,
          confirmPassword: formValue.confirmPassword,
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          phone: formValue.phone,
          role: formValue.role,
        });

        if (result.success && result.user) {
          this.successMessage.set('Compte créé avec succès ! Redirection...');
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        } else {
          this.errorMessage.set(
            result.error || 'Erreur lors de la création du compte',
          );
        }
      } catch {
        this.errorMessage.set('Erreur lors de la création du compte');
      } finally {
        this.isLoading.set(false);
      }
    }
  }
}
