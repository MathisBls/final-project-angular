import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Mon Profil</h1>
            <p class="text-gray-600">Gérez vos informations personnelles</p>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-8">
            <form
              [formGroup]="profileForm"
              (ngSubmit)="onSubmit()"
              class="space-y-6"
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

              <!-- Informations personnelles -->
              <div class="space-y-6">
                <h3 class="text-lg font-semibold text-gray-900">
                  Informations personnelles
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      for="firstName"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Prénom
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      formControlName="firstName"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      [class.border-red-300]="
                        profileForm.get('firstName')?.invalid &&
                        profileForm.get('firstName')?.touched
                      "
                    />
                    @if (
                      profileForm.get('firstName')?.invalid &&
                      profileForm.get('firstName')?.touched
                    ) {
                      <p class="mt-1 text-sm text-red-600">
                        Le prénom est requis
                      </p>
                    }
                  </div>

                  <div>
                    <label
                      for="lastName"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nom
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      formControlName="lastName"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      [class.border-red-300]="
                        profileForm.get('lastName')?.invalid &&
                        profileForm.get('lastName')?.touched
                      "
                    />
                    @if (
                      profileForm.get('lastName')?.invalid &&
                      profileForm.get('lastName')?.touched
                    ) {
                      <p class="mt-1 text-sm text-red-600">Le nom est requis</p>
                    }
                  </div>

                  <div>
                    <label
                      for="email"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      formControlName="email"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      [class.border-red-300]="
                        profileForm.get('email')?.invalid &&
                        profileForm.get('email')?.touched
                      "
                    />
                    @if (
                      profileForm.get('email')?.invalid &&
                      profileForm.get('email')?.touched
                    ) {
                      <p class="mt-1 text-sm text-red-600">Email invalide</p>
                    }
                  </div>

                  <div>
                    <label
                      for="phone"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Téléphone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      formControlName="phone"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      [class.border-red-300]="
                        profileForm.get('phone')?.invalid &&
                        profileForm.get('phone')?.touched
                      "
                    />
                    @if (
                      profileForm.get('phone')?.invalid &&
                      profileForm.get('phone')?.touched
                    ) {
                      <p class="mt-1 text-sm text-red-600">
                        Le téléphone est requis
                      </p>
                    }
                  </div>
                </div>

                <!-- Informations du rôle -->
                <div class="pt-6 border-t border-gray-200">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">
                    Informations du compte
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div class="block text-sm font-medium text-gray-700 mb-2">
                        Rôle
                      </div>
                      <div class="px-3 py-2 bg-gray-100 rounded-md">
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          [class.bg-blue-100]="currentUser()?.role === 'admin'"
                          [class.text-blue-800]="
                            currentUser()?.role === 'admin'
                          "
                          [class.bg-green-100]="
                            currentUser()?.role === 'doctor'
                          "
                          [class.text-green-800]="
                            currentUser()?.role === 'doctor'
                          "
                          [class.bg-purple-100]="
                            currentUser()?.role === 'patient'
                          "
                          [class.text-purple-800]="
                            currentUser()?.role === 'patient'
                          "
                        >
                          @if (currentUser()?.role === 'admin') {
                            Administrateur
                          } @else if (currentUser()?.role === 'doctor') {
                            Médecin
                          } @else if (currentUser()?.role === 'patient') {
                            Patient
                          }
                        </span>
                      </div>
                    </div>

                    <div>
                      <div class="block text-sm font-medium text-gray-700 mb-2">
                        Membre depuis
                      </div>
                      <div class="px-3 py-2 bg-gray-100 rounded-md">
                        {{ currentUser()?.createdAt | date: 'dd/MM/yyyy' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Boutons d'action -->
              <div
                class="flex justify-end space-x-4 pt-6 border-t border-gray-200"
              >
                <button
                  type="submit"
                  [disabled]="profileForm.invalid || isLoading()"
                  class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  @if (isLoading()) {
                    Sauvegarde en cours...
                  } @else {
                    Mettre à jour mon profil
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  currentUser = this.authService.currentUserSignal;
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  profileForm: FormGroup;

  constructor() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const user = this.currentUser();
    if (user) {
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      });
    }
  }

  async onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');

      try {
        const formValue = this.profileForm.value;

        await this.authService.updateProfile({
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          email: formValue.email,
          phone: formValue.phone,
        });

        this.successMessage.set('Profil mis à jour avec succès !');

        setTimeout(() => {
          this.successMessage.set('');
        }, 3000);
      } catch (error) {
        this.errorMessage.set('Erreur lors de la mise à jour du profil');
        console.error('Erreur:', error);
      } finally {
        this.isLoading.set(false);
      }
    }
  }
}
