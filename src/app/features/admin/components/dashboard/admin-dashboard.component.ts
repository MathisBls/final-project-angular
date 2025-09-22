import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { AppointmentService } from '../../../appointments/services/appointment.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Administration Doctolib
          </h1>
          <p class="text-gray-600">
            Gérez la plateforme et supervisez l'activité
          </p>
        </div>

        <!-- Statistiques -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">
                  Utilisateurs totaux
                </p>
                <p class="text-2xl font-semibold text-gray-900">
                  {{ totalUsers() }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100 text-green-600">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Médecins actifs</p>
                <p class="text-2xl font-semibold text-gray-900">
                  {{ activeDoctors() }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">
                  Rendez-vous du jour
                </p>
                <p class="text-2xl font-semibold text-gray-900">
                  {{ todayAppointments() }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  ></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Revenus totaux</p>
                <p class="text-2xl font-semibold text-gray-900">
                  {{ totalRevenue() }}€
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions rapides -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Gestion des médecins
            </h3>
            <div class="space-y-3">
              <a
                routerLink="/admin/doctors"
                class="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <svg
                  class="w-5 h-5 text-blue-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
                <span class="text-blue-800 font-medium"
                  >Voir tous les médecins</span
                >
              </a>
              <a
                routerLink="/admin/doctors/create"
                class="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <svg
                  class="w-5 h-5 text-green-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                <span class="text-green-800 font-medium"
                  >Ajouter un médecin</span
                >
              </a>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Gestion des patients
            </h3>
            <div class="space-y-3">
              <a
                routerLink="/admin/patients"
                class="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <svg
                  class="w-5 h-5 text-purple-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  ></path>
                </svg>
                <span class="text-purple-800 font-medium"
                  >Voir tous les patients</span
                >
              </a>
            </div>
          </div>
        </div>

        <!-- Rendez-vous récents -->
        <div class="mt-8 bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Rendez-vous récents
          </h3>
          <div class="space-y-3">
            @if (recentAppointments().length > 0) {
              @for (appointment of recentAppointments(); track appointment.id) {
                <div
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p class="font-medium text-gray-900">
                      {{ appointment.patient.user.firstName }}
                      {{ appointment.patient.user.lastName }} avec Dr.
                      {{ appointment.doctor.user.firstName }}
                      {{ appointment.doctor.user.lastName }}
                    </p>
                    <p class="text-sm text-gray-600">
                      {{ appointment.date | date: 'dd/MM/yyyy' }} à
                      {{ appointment.time }}
                    </p>
                  </div>
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                    [class.bg-yellow-100]="appointment.status === 'scheduled'"
                    [class.text-yellow-800]="appointment.status === 'scheduled'"
                    [class.bg-green-100]="appointment.status === 'confirmed'"
                    [class.text-green-800]="appointment.status === 'confirmed'"
                    [class.bg-blue-100]="appointment.status === 'completed'"
                    [class.text-blue-800]="appointment.status === 'completed'"
                  >
                    {{ appointment.status | titlecase }}
                  </span>
                </div>
              }
            } @else {
              <p class="text-gray-500 text-center py-4">
                Aucun rendez-vous récent
              </p>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private doctorService = inject(DoctorService);
  private appointmentService = inject(AppointmentService);

  totalUsers = signal(156);
  activeDoctors = signal(23);
  todayAppointments = signal(8);
  totalRevenue = signal(15600);

  recentAppointments = signal([
    {
      id: 1,
      date: new Date('2024-01-20'),
      time: '10:00',
      status: 'scheduled',
      patient: {
        user: { firstName: 'Marie', lastName: 'Dubois' },
      },
      doctor: {
        user: { firstName: 'Jean', lastName: 'Martin' },
      },
    },
    {
      id: 2,
      date: new Date('2024-01-18'),
      time: '14:30',
      status: 'completed',
      patient: {
        user: { firstName: 'Pierre', lastName: 'Martin' },
      },
      doctor: {
        user: { firstName: 'Sophie', lastName: 'Bernard' },
      },
    },
  ]);

  ngOnInit() {
    this.loadStats();
  }

  async loadStats() {
    try {
      const doctors = await this.doctorService.getAllDoctors();
      this.activeDoctors.set(doctors.filter((d) => d.isAvailable).length);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  }
}
