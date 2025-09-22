import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DoctorService } from '../../services/doctor.service';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Doctor } from '../../models/doctor.model';
import { AppointmentSlot } from '../../../appointments/models/appointment.model';

@Component({
  selector: 'app-doctor-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    @if (doctor()) {
      <div class="min-h-screen bg-gray-50 py-8">
        <div class="container mx-auto px-4">
          <!-- En-tête du docteur -->
          <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div class="flex flex-col md:flex-row gap-8">
              <!-- Photo du docteur -->
              <div class="flex-shrink-0">
                <div
                  class="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <span class="text-4xl font-bold text-blue-600">
                    {{ doctor()?.user?.firstName?.charAt(0)
                    }}{{ doctor()?.user?.lastName?.charAt(0) }}
                  </span>
                </div>
              </div>

              <!-- Informations du docteur -->
              <div class="flex-1">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                  {{ doctor()?.user?.firstName }} {{ doctor()?.user?.lastName }}
                </h1>
                <p class="text-xl text-blue-600 mb-4">
                  {{ doctor()?.speciality }}
                </p>

                <div class="flex items-center mb-4">
                  <div class="flex items-center">
                    @for (star of [1, 2, 3, 4, 5]; track star) {
                      <svg
                        class="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        ></path>
                      </svg>
                    }
                    <span class="ml-2 text-sm text-gray-600">
                      {{ doctor()?.rating }}/5 ({{
                        doctor()?.totalReviews
                      }}
                      avis)
                    </span>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div class="flex items-center">
                    <svg
                      class="w-4 h-4 text-gray-400 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    {{ doctor()?.experience }} ans d'expérience
                  </div>
                  <div class="flex items-center">
                    <svg
                      class="w-4 h-4 text-gray-400 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    {{ doctor()?.consultationFee }}€ la consultation
                  </div>
                  <div class="flex items-center">
                    <svg
                      class="w-4 h-4 text-gray-400 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    {{ doctor()?.languages?.join(', ') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Bio du docteur -->
            <div class="mt-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">À propos</h3>
              <p class="text-gray-600 leading-relaxed">{{ doctor()?.bio }}</p>
            </div>

            <!-- Formation -->
            <div class="mt-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Formation
              </h3>
              <ul class="list-disc list-inside text-gray-600">
                @for (education of doctor()?.education; track education) {
                  <li>{{ education }}</li>
                }
              </ul>
            </div>
          </div>

          <!-- Formulaire de réservation -->
          @if (currentUser()?.role === 'patient') {
            <div class="bg-white rounded-lg shadow-lg p-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">
                Prendre rendez-vous
              </h2>

              <form
                [formGroup]="appointmentForm"
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

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      for="date"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Date du rendez-vous
                    </label>
                    <input
                      id="date"
                      type="date"
                      formControlName="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      [min]="minDate"
                    />
                  </div>

                  <div>
                    <label
                      for="time"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Heure
                    </label>
                    <select
                      id="time"
                      formControlName="time"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner une heure</option>
                      @for (slot of availableSlots(); track slot.time) {
                        <option
                          [value]="slot.time"
                          [disabled]="!slot.isAvailable"
                        >
                          {{ slot.time }}
                          {{ slot.isAvailable ? '' : '(Indisponible)' }}
                        </option>
                      }
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    for="reason"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Motif de la consultation
                  </label>
                  <textarea
                    id="reason"
                    formControlName="reason"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Décrivez brièvement le motif de votre consultation..."
                  ></textarea>
                </div>

                <div>
                  <label
                    for="symptoms"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Symptômes (optionnel)
                  </label>
                  <textarea
                    id="symptoms"
                    formControlName="symptoms"
                    rows="2"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Décrivez vos symptômes si nécessaire..."
                  ></textarea>
                </div>

                <div class="flex justify-end">
                  <button
                    type="submit"
                    [disabled]="appointmentForm.invalid || isLoading()"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    @if (isLoading()) {
                      Réservation en cours...
                    } @else {
                      Confirmer le rendez-vous
                    }
                  </button>
                </div>
              </form>
            </div>
          } @else {
            <div
              class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center"
            >
              <p class="text-yellow-800">
                Vous devez être connecté en tant que patient pour prendre un
                rendez-vous.
                <a
                  routerLink="/auth/login"
                  class="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Se connecter
                </a>
              </p>
            </div>
          }
        </div>
      </div>
    } @else {
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
          ></div>
          <p class="text-gray-600">Chargement du docteur...</p>
        </div>
      </div>
    }
  `,
  styles: [],
})
export class DoctorDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private doctorService = inject(DoctorService);
  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  doctor = signal<Doctor | null>(null);
  availableSlots = signal<AppointmentSlot[]>([]);
  currentUser = this.authService.currentUserSignal;
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  appointmentForm: FormGroup;
  minDate = new Date().toISOString().split('T')[0];

  constructor() {
    this.appointmentForm = this.fb.group({
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      reason: ['', [Validators.required, Validators.minLength(10)]],
      symptoms: [''],
      duration: [30],
    });
  }

  ngOnInit() {
    const doctorId = this.route.snapshot.paramMap.get('id');
    if (doctorId) {
      this.loadDoctor(parseInt(doctorId));
    }
  }

  async loadDoctor(id: number) {
    try {
      const doctor = await this.doctorService.getDoctorById(id);
      if (doctor) {
        this.doctor.set(doctor);
        this.loadAvailableSlots(id);
      } else {
        this.router.navigate(['/doctors']);
      }
    } catch {
      console.error('Erreur lors du chargement du docteur');
      this.router.navigate(['/doctors']);
    }
  }

  async loadAvailableSlots(doctorId: number) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const slots = await this.appointmentService.getAvailableSlots(
        doctorId,
        today,
      );
      this.availableSlots.set(slots);
    } catch (error) {
      console.error('Erreur lors du chargement des créneaux:', error);
    }
  }

  async onSubmit() {
    if (this.appointmentForm.valid && this.doctor() && this.currentUser()) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');

      try {
        const formValue = this.appointmentForm.value;
        const appointmentData = {
          patientId: this.currentUser()!.id,
          doctorId: this.doctor()!.id,
          date: new Date(formValue.date),
          time: formValue.time,
          duration: formValue.duration,
          reason: formValue.reason,
          symptoms: formValue.symptoms || '',
        };

        await this.appointmentService.createAppointment(appointmentData);

        this.successMessage.set('Rendez-vous confirmé avec succès !');
        this.appointmentForm.reset();

        setTimeout(() => {
          this.router.navigate(['/appointments']);
        }, 2000);
      } catch {
        this.errorMessage.set('Erreur lors de la réservation du rendez-vous');
      } finally {
        this.isLoading.set(false);
      }
    }
  }
}
