import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Appointment } from '../../../appointments/models/appointment.model';

interface PatientSummary {
  patientId: number;
  patient: Appointment['patient'];
  totalAppointments: number;
  lastAppointment: Date | null;
  nextAppointment: Date | null;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-doctor-patients',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Mes Patients</h1>
          <p class="text-gray-600">Gérez vos patients et leurs rendez-vous</p>
        </div>

        @if (isLoading()) {
          <div class="flex justify-center py-12">
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
            ></div>
          </div>
        } @else {
          <!-- Statistiques -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                    Patients totaux
                  </p>
                  <p class="text-2xl font-semibold text-gray-900">
                    {{ patients().length }}
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
                  <p class="text-sm font-medium text-gray-600">
                    Patients actifs
                  </p>
                  <p class="text-2xl font-semibold text-gray-900">
                    {{ activePatients }}
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
                  <p class="text-sm font-medium text-gray-600">RDV ce mois</p>
                  <p class="text-2xl font-semibold text-gray-900">
                    {{ monthlyAppointments }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Liste des patients -->
          <div class="space-y-4">
            @if (patients().length > 0) {
              @for (patient of patients(); track patient.patientId) {
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
                            {{ patient.patient.user.firstName.charAt(0)
                            }}{{ patient.patient.user.lastName.charAt(0) }}
                          </span>
                        </div>
                        <div>
                          <h3 class="text-lg font-semibold text-gray-900">
                            {{ patient.patient.user.firstName }}
                            {{ patient.patient.user.lastName }}
                          </h3>
                          <p class="text-gray-600">
                            {{ patient.patient.user.email }}
                          </p>
                        </div>
                      </div>

                      <div
                        class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"
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
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            ></path>
                          </svg>
                          {{ patient.patient.user.phone }}
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            ></path>
                          </svg>
                          {{ patient.totalAppointments }} rendez-vous
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
                          @if (patient.lastAppointment) {
                            Dernier RDV:
                            {{ patient.lastAppointment | date: 'dd/MM/yyyy' }}
                          } @else {
                            Aucun RDV
                          }
                        </div>
                      </div>

                      @if (patient.nextAppointment) {
                        <div class="mt-4 p-3 bg-blue-50 rounded-md">
                          <p class="text-sm text-blue-800">
                            <strong>Prochain rendez-vous :</strong>
                            {{
                              patient.nextAppointment
                                | date: 'dd/MM/yyyy à HH:mm'
                            }}
                          </p>
                        </div>
                      }
                    </div>

                    <!-- Actions -->
                    <div class="flex flex-col items-end space-y-3 mt-4 md:mt-0">
                      <span
                        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                        [class.bg-green-100]="patient.status === 'active'"
                        [class.text-green-800]="patient.status === 'active'"
                        [class.bg-gray-100]="patient.status === 'inactive'"
                        [class.text-gray-800]="patient.status === 'inactive'"
                      >
                        @if (patient.status === 'active') {
                          Actif
                        } @else {
                          Inactif
                        }
                      </span>

                      <div class="flex space-x-2">
                        <button
                          (click)="viewPatientHistory(patient.patientId)"
                          class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                          Historique
                        </button>
                        <button
                          (click)="scheduleAppointment(patient.patientId)"
                          class="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                        >
                          Nouveau RDV
                        </button>
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">
                  Aucun patient
                </h3>
                <p class="text-gray-500 mb-6">
                  Vous n'avez pas encore de patients.
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
export class DoctorPatientsComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);

  patients = signal<PatientSummary[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.loadPatients();
  }

  async loadPatients() {
    this.isLoading.set(true);
    try {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        const allAppointments =
          await this.appointmentService.getAllAppointments();
        const doctorAppointments = allAppointments.filter(
          (appointment) => appointment.doctor.user.id === currentUser.id,
        );

        // Grouper les rendez-vous par patient
        const patientMap = new Map<number, PatientSummary>();

        doctorAppointments.forEach((appointment) => {
          const patientId = appointment.patientId;

          if (!patientMap.has(patientId)) {
            patientMap.set(patientId, {
              patientId,
              patient: appointment.patient,
              totalAppointments: 0,
              lastAppointment: null,
              nextAppointment: null,
              status: 'active',
            });
          }

          const patientSummary = patientMap.get(patientId)!;
          patientSummary.totalAppointments++;

          // Trouver le dernier rendez-vous
          if (
            !patientSummary.lastAppointment ||
            appointment.date > patientSummary.lastAppointment
          ) {
            patientSummary.lastAppointment = appointment.date;
          }

          // Trouver le prochain rendez-vous (futur)
          const appointmentDate = new Date(appointment.date);
          const now = new Date();
          if (appointmentDate > now) {
            if (
              !patientSummary.nextAppointment ||
              appointmentDate < patientSummary.nextAppointment
            ) {
              patientSummary.nextAppointment = appointmentDate;
            }
          }
        });

        this.patients.set(Array.from(patientMap.values()));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des patients:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  get activePatients(): number {
    return this.patients().filter((p) => p.status === 'active').length;
  }

  get monthlyAppointments(): number {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return this.patients().reduce((total, patient) => {
      if (
        patient.lastAppointment &&
        patient.lastAppointment >= startOfMonth &&
        patient.lastAppointment <= endOfMonth
      ) {
        return total + 1;
      }
      return total;
    }, 0);
  }

  viewPatientHistory(patientId: number) {
    // TODO: Implémenter la vue de l'historique du patient
    console.log('Voir historique patient:', patientId);
  }

  scheduleAppointment(patientId: number) {
    // TODO: Implémenter la prise de nouveau rendez-vous
    console.log('Programmer nouveau RDV pour patient:', patientId);
  }
}
