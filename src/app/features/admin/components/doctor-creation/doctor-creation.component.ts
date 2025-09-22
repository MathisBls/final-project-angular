import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { AuthService } from '../../../auth/services/auth.service';
import { CreateDoctorRequest } from '../../../doctors/models/doctor.model';
import { User } from '../../../auth/models/user.model';

@Component({
  selector: 'app-doctor-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              Créer un nouveau médecin
            </h1>
            <p class="text-gray-600">
              Ajoutez un nouveau médecin à la plateforme
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-8">
            <form
              [formGroup]="doctorForm"
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
              <div class="border-b border-gray-200 pb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
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
                      placeholder="Prénom du médecin"
                      [class.border-red-300]="
                        doctorForm.get('firstName')?.invalid &&
                        doctorForm.get('firstName')?.touched
                      "
                    />
                    @if (
                      doctorForm.get('firstName')?.invalid &&
                      doctorForm.get('firstName')?.touched
                    ) {
                      <p class="mt-1 text-sm text-red-600">
                        Le prénom est requis (minimum 2 caractères)
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
                      placeholder="Nom du médecin"
                    />
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
                      placeholder="email@exemple.com"
                    />
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
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>
                </div>
              </div>

              <!-- Informations professionnelles -->
              <div class="border-b border-gray-200 pb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  Informations professionnelles
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      for="licenseNumber"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Numéro de licence
                    </label>
                    <input
                      id="licenseNumber"
                      type="text"
                      formControlName="licenseNumber"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="CARD123456"
                    />
                  </div>
                  <div>
                    <label
                      for="experience"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Années d'expérience
                    </label>
                    <input
                      id="experience"
                      type="number"
                      formControlName="experience"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="5"
                      min="0"
                    />
                  </div>
                  <div>
                    <label
                      for="consultationFee"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Tarif de consultation (€)
                    </label>
                    <input
                      id="consultationFee"
                      type="number"
                      formControlName="consultationFee"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="80"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <!-- Bio et formation -->
              <div class="border-b border-gray-200 pb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  Description et formation
                </h3>
                <div class="space-y-6">
                  <div>
                    <label
                      for="bio"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Biographie
                    </label>
                    <textarea
                      id="bio"
                      formControlName="bio"
                      rows="4"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Décrivez l'expérience et les spécialisations du médecin (minimum 10 caractères)..."
                      [class.border-red-300]="
                        doctorForm.get('bio')?.invalid &&
                        doctorForm.get('bio')?.touched
                      "
                    ></textarea>
                    @if (
                      doctorForm.get('bio')?.invalid &&
                      doctorForm.get('bio')?.touched
                    ) {
                      <p class="mt-1 text-sm text-red-600">
                        La biographie est requise (minimum 10 caractères)
                      </p>
                    }
                  </div>
                  <div>
                    <label
                      for="education"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Formation (une par ligne)
                    </label>
                    <textarea
                      id="education"
                      formControlName="education"
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Université de Paris&#10;Spécialisation en Cardiologie"
                    ></textarea>
                  </div>
                  <div>
                    <label
                      for="languages"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Langues parlées (séparées par des virgules)
                    </label>
                    <input
                      id="languages"
                      type="text"
                      formControlName="languages"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Français, Anglais, Espagnol"
                    />
                  </div>
                </div>
              </div>

              <!-- Mot de passe -->
              <div class="pb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Accès</h3>
                <div class="grid grid-cols-1 gap-6">
                  <div>
                    <label
                      for="password"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Mot de passe
                    </label>
                    <input
                      id="password"
                      type="password"
                      formControlName="password"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Mot de passe pour le médecin"
                    />
                    @if (
                      doctorForm.get('password')?.invalid &&
                      doctorForm.get('password')?.touched
                    ) {
                      <p class="mt-1 text-sm text-red-600">
                        Le mot de passe doit contenir au moins 6 caractères
                      </p>
                    }
                  </div>
                </div>
              </div>

              <!-- Boutons d'action -->
              <div class="flex justify-end space-x-4">
                <button
                  type="button"
                  (click)="onCancel()"
                  class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  [disabled]="doctorForm.invalid || isLoading()"
                  class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  @if (isLoading()) {
                    Création en cours...
                  } @else {
                    Créer le médecin
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
export class DoctorCreationComponent {
  private doctorService = inject(DoctorService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  doctorForm: FormGroup;

  constructor() {
    this.doctorForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      licenseNumber: ['', [Validators.required]],
      experience: [0, [Validators.required, Validators.min(0)]],
      consultationFee: [0, [Validators.required, Validators.min(0)]],
      bio: ['', [Validators.required, Validators.minLength(10)]],
      education: ['Université de Paris', [Validators.required]],
      languages: ['Français, Anglais', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (this.doctorForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');

      try {
        const formValue = this.doctorForm.value;

        const userResult = await this.authService.createUserWithoutLogin({
          email: formValue.email,
          password: formValue.password,
          confirmPassword: formValue.password,
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          phone: formValue.phone,
          role: 'doctor',
        });

        if (!userResult.success || !userResult.user) {
          throw new Error(
            userResult.error || "Erreur lors de la création de l'utilisateur",
          );
        }

        const doctorData: CreateDoctorRequest = {
          userId: userResult.user.id,
          speciality: 'Médecine générale',
          licenseNumber: formValue.licenseNumber,
          experience: formValue.experience,
          consultationFee: formValue.consultationFee,
          bio: formValue.bio,
          education: formValue.education
            .split('\n')
            .filter((edu: string) => edu.trim()),
          languages: formValue.languages
            .split(',')
            .map((lang: string) => lang.trim()),
          workingHours: {
            monday: [{ start: '09:00', end: '17:00', isAvailable: true }],
            tuesday: [{ start: '09:00', end: '17:00', isAvailable: true }],
            wednesday: [{ start: '09:00', end: '17:00', isAvailable: true }],
            thursday: [{ start: '09:00', end: '17:00', isAvailable: true }],
            friday: [{ start: '09:00', end: '17:00', isAvailable: true }],
            saturday: [],
            sunday: [],
          },
        };

        const savedUsers = localStorage.getItem('doctolib_users');
        if (!savedUsers) {
          throw new Error('Données utilisateurs non trouvées');
        }
        const users = JSON.parse(savedUsers);
        const user = users.find((u: User) => u.id === doctorData.userId);

        if (!user) {
          throw new Error('Utilisateur non trouvé');
        }

        await this.doctorService.createDoctor(doctorData, user);

        this.successMessage.set('Médecin créé avec succès !');

        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 2000);
      } catch (error) {
        this.errorMessage.set('Erreur lors de la création du médecin');
        console.error('Erreur:', error);
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  onCancel() {
    this.router.navigate(['/admin']);
  }

  getFormErrors() {
    const errors: Record<string, unknown> = {};
    Object.keys(this.doctorForm.controls).forEach((key) => {
      const control = this.doctorForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
}
