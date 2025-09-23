import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Appointment } from '../../../appointments/models/appointment.model';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Mes Rendez-vous</h1>
          <p class="text-gray-600">Gérez vos rendez-vous avec vos patients</p>
        </div>

        @if (isLoading()) {
          <div class="flex justify-center py-12">
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
            ></div>
          </div>
        } @else {
          <!-- Filtres -->
          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <div class="flex flex-wrap gap-4">
              <button
                (click)="setFilter('all')"
                class="px-4 py-2 rounded-md transition-colors"
                [class.bg-blue-600]="currentFilter() === 'all'"
                [class.text-white]="currentFilter() === 'all'"
                [class.bg-gray-200]="currentFilter() !== 'all'"
                [class.text-gray-700]="currentFilter() !== 'all'"
              >
                Tous ({{ appointments().length }})
              </button>
              <button
                (click)="setFilter('scheduled')"
                class="px-4 py-2 rounded-md transition-colors"
                [class.bg-blue-600]="currentFilter() === 'scheduled'"
                [class.text-white]="currentFilter() === 'scheduled'"
                [class.bg-gray-200]="currentFilter() !== 'scheduled'"
                [class.text-gray-700]="currentFilter() !== 'scheduled'"
              >
                Programmés ({{ getAppointmentsByStatus('scheduled').length }})
              </button>
              <button
                (click)="setFilter('confirmed')"
                class="px-4 py-2 rounded-md transition-colors"
                [class.bg-blue-600]="currentFilter() === 'confirmed'"
                [class.text-white]="currentFilter() === 'confirmed'"
                [class.bg-gray-200]="currentFilter() !== 'confirmed'"
                [class.text-gray-700]="currentFilter() !== 'confirmed'"
              >
                Confirmés ({{ getAppointmentsByStatus('confirmed').length }})
              </button>
              <button
                (click)="setFilter('completed')"
                class="px-4 py-2 rounded-md transition-colors"
                [class.bg-blue-600]="currentFilter() === 'completed'"
                [class.text-white]="currentFilter() === 'completed'"
                [class.bg-gray-200]="currentFilter() !== 'completed'"
                [class.text-gray-700]="currentFilter() !== 'completed'"
              >
                Terminés ({{ getAppointmentsByStatus('completed').length }})
              </button>
            </div>
          </div>

          <!-- Liste des rendez-vous -->
          <div class="space-y-4">
            @if (filteredAppointments().length > 0) {
              @for (
                appointment of filteredAppointments();
                track appointment.id
              ) {
                <div class="bg-white rounded-lg shadow p-6">
                  <div
                    class="flex flex-col md:flex-row md:items-center md:justify-between"
                  >
                    <!-- Informations du patient -->
                    <div class="flex-1">
                      <div class="flex items-center mb-4">
                        <div
                          class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4"
                        >
                          <span class="text-lg font-bold text-green-600">
                            {{ appointment.patient.user.firstName.charAt(0)
                            }}{{ appointment.patient.user.lastName.charAt(0) }}
                          </span>
                        </div>
                        <div>
                          <h3 class="text-lg font-semibold text-gray-900">
                            {{ appointment.patient.user.firstName }}
                            {{ appointment.patient.user.lastName }}
                          </h3>
                          <p class="text-gray-600">Patient</p>
                        </div>
                      </div>

                      <div
                        class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
                      >
                        <div class="flex items-center">
                          <svg
                            class="w-4 h-4 text-gray-400 mr-2"
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
                          {{ appointment.date | date: 'dd/MM/yyyy' }} à
                          {{ appointment.time }}
                        </div>
                        <div class="flex items-center">
                          <svg
                            class="w-4 h-4 text-gray-400 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          {{ appointment.duration }} minutes
                        </div>
                        <div class="flex items-center">
                          <svg
                            class="w-4 h-4 text-gray-400 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            ></path>
                          </svg>
                          {{ appointment.patient.user.phone }}
                        </div>
                        <div class="flex items-center">
                          <svg
                            class="w-4 h-4 text-gray-400 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            ></path>
                          </svg>
                          {{ appointment.reason }}
                        </div>
                      </div>

                      @if (appointment.symptoms) {
                        <div class="mt-4 p-3 bg-gray-50 rounded-md">
                          <p class="text-sm text-gray-600">
                            <strong>Symptômes :</strong>
                            {{ appointment.symptoms }}
                          </p>
                        </div>
                      }

                      @if (appointment.notes) {
                        <div class="mt-4 p-3 bg-blue-50 rounded-md">
                          <p class="text-sm text-blue-800">
                            <strong>Notes :</strong>
                            {{ appointment.notes }}
                          </p>
                        </div>
                      }
                    </div>

                    <!-- Statut et actions -->
                    <div class="flex flex-col items-end space-y-3 mt-4 md:mt-0">
                      <span
                        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                        [class.bg-yellow-100]="
                          appointment.status === 'scheduled'
                        "
                        [class.text-yellow-800]="
                          appointment.status === 'scheduled'
                        "
                        [class.bg-green-100]="
                          appointment.status === 'confirmed'
                        "
                        [class.text-green-800]="
                          appointment.status === 'confirmed'
                        "
                        [class.bg-blue-100]="appointment.status === 'completed'"
                        [class.text-blue-800]="
                          appointment.status === 'completed'
                        "
                        [class.bg-red-100]="appointment.status === 'cancelled'"
                        [class.text-red-800]="
                          appointment.status === 'cancelled'
                        "
                      >
                        @if (appointment.status === 'scheduled') {
                          Programmé
                        } @else if (appointment.status === 'confirmed') {
                          Confirmé
                        } @else if (appointment.status === 'completed') {
                          Terminé
                        } @else if (appointment.status === 'cancelled') {
                          Annulé
                        }
                      </span>

                      <div class="flex space-x-2">
                        @if (appointment.status === 'scheduled') {
                          <button
                            (click)="confirmAppointment(appointment.id)"
                            class="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                          >
                            Confirmer
                          </button>
                        }
                        @if (appointment.status === 'confirmed') {
                          <button
                            (click)="completeAppointment(appointment.id)"
                            class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                          >
                            Terminer
                          </button>
                        }
                        @if (
                          appointment.status === 'scheduled' ||
                          appointment.status === 'confirmed'
                        ) {
                          <button
                            (click)="cancelAppointment(appointment.id)"
                            class="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                          >
                            Annuler
                          </button>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              }
            } @else {
              <div class="bg-white rounded-lg shadow p-12 text-center">
                <svg
                  class="mx-auto h-12 w-12 text-gray-400 mb-4"
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
                <h3 class="text-lg font-medium text-gray-900 mb-2">
                  Aucun rendez-vous
                </h3>
                <p class="text-gray-500 mb-6">
                  @if (currentFilter() === 'all') {
                    Vous n'avez pas encore de rendez-vous.
                  } @else {
                    Aucun rendez-vous {{ getFilterLabel() }}.
                  }
                </p>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class DoctorAppointmentsComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);

  appointments = signal<Appointment[]>([]);
  filteredAppointments = signal<Appointment[]>([]);
  currentFilter = signal<string>('all');
  isLoading = signal(false);

  ngOnInit() {
    this.loadAppointments();
  }

  async loadAppointments() {
    this.isLoading.set(true);
    try {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser && currentUser.role === 'doctor') {
        const allAppointments =
          await this.appointmentService.getAllAppointments();

        const doctorAppointments = allAppointments.filter(
          (appointment) => appointment.doctor.user.id === currentUser.id,
        );

        this.appointments.set(doctorAppointments);
        this.applyFilter();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  setFilter(filter: string) {
    this.currentFilter.set(filter);
    this.applyFilter();
  }

  applyFilter() {
    const filter = this.currentFilter();
    if (filter === 'all') {
      this.filteredAppointments.set(this.appointments());
    } else {
      const filtered = this.appointments().filter(
        (appointment) => appointment.status === filter,
      );
      this.filteredAppointments.set(filtered);
    }
  }

  getAppointmentsByStatus(status: string): Appointment[] {
    return this.appointments().filter(
      (appointment) => appointment.status === status,
    );
  }

  getFilterLabel(): string {
    const filter = this.currentFilter();
    switch (filter) {
      case 'scheduled':
        return 'programmés';
      case 'confirmed':
        return 'confirmés';
      case 'completed':
        return 'terminés';
      case 'cancelled':
        return 'annulés';
      default:
        return '';
    }
  }

  async confirmAppointment(appointmentId: number) {
    try {
      await this.appointmentService.updateAppointment(appointmentId, {
        status: 'confirmed',
      });
      this.loadAppointments();
    } catch (error) {
      console.error('Erreur lors de la confirmation du rendez-vous:', error);
    }
  }

  async completeAppointment(appointmentId: number) {
    try {
      await this.appointmentService.updateAppointment(appointmentId, {
        status: 'completed',
      });
      this.loadAppointments();
    } catch (error) {
      console.error('Erreur lors de la finalisation du rendez-vous:', error);
    }
  }

  async cancelAppointment(appointmentId: number) {
    if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      try {
        await this.appointmentService.updateAppointment(appointmentId, {
          status: 'cancelled',
        });
        this.loadAppointments();
      } catch (error) {
        console.error("Erreur lors de l'annulation du rendez-vous:", error);
      }
    }
  }
}
