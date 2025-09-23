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

          <div class="space-y-4">
            @if (patients().length > 0) {
              @for (patient of patients(); track patient.patientId) {
                <div class="bg-white rounded-lg shadow p-6">
                  <div
                    class="flex flex-col md:flex-row md:items-center md:justify-between"
                  >
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

      @if (showHistoryModal()) {
        <div
          class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
          (click)="closeHistoryModal()"
          (keydown.escape)="closeHistoryModal()"
          tabindex="0"
          role="dialog"
          aria-modal="true"
        >
          <div
            class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
            (click)="$event.stopPropagation()"
            (keydown.enter)="$event.stopPropagation()"
            (keydown.space)="$event.stopPropagation()"
            tabindex="0"
          >
            <div class="mt-3">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">
                  Historique des rendez-vous
                </h3>
                <button
                  (click)="closeHistoryModal()"
                  class="text-gray-400 hover:text-gray-600"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              @if (selectedPatient()) {
                <div class="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div class="flex items-center">
                    <div
                      class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4"
                    >
                      <span class="text-lg font-bold text-blue-600">
                        {{ selectedPatient()!.patient.user.firstName.charAt(0)
                        }}{{
                          selectedPatient()!.patient.user.lastName.charAt(0)
                        }}
                      </span>
                    </div>
                    <div>
                      <h4 class="text-lg font-semibold text-gray-900">
                        {{ selectedPatient()!.patient.user.firstName }}
                        {{ selectedPatient()!.patient.user.lastName }}
                      </h4>
                      <p class="text-gray-600">
                        {{ selectedPatient()!.patient.user.email }}
                      </p>
                      <p class="text-sm text-gray-500">
                        {{ selectedPatient()!.patient.user.phone }}
                      </p>
                    </div>
                  </div>
                </div>
              }

              <div class="max-h-96 overflow-y-auto">
                @if (patientHistory().length > 0) {
                  <div class="space-y-4">
                    @for (
                      appointment of patientHistory();
                      track appointment.id
                    ) {
                      <div class="border rounded-lg p-4 hover:bg-gray-50">
                        <div class="flex justify-between items-start mb-2">
                          <div>
                            <h5 class="font-semibold text-gray-900">
                              {{ appointment.date | date: 'dd/MM/yyyy' }} à
                              {{ appointment.time }}
                            </h5>
                            <p class="text-sm text-gray-600">
                              {{ appointment.reason }}
                            </p>
                          </div>
                          <span
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
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
                            [class.bg-blue-100]="
                              appointment.status === 'completed'
                            "
                            [class.text-blue-800]="
                              appointment.status === 'completed'
                            "
                            [class.bg-red-100]="
                              appointment.status === 'cancelled'
                            "
                            [class.text-red-800]="
                              appointment.status === 'cancelled'
                            "
                          >
                            {{ getStatusLabel(appointment.status) }}
                          </span>
                        </div>

                        @if (appointment.symptoms) {
                          <div class="mt-2">
                            <p class="text-sm text-gray-600">
                              <strong>Symptômes :</strong>
                              {{ appointment.symptoms }}
                            </p>
                          </div>
                        }

                        @if (appointment.notes) {
                          <div class="mt-2">
                            <p class="text-sm text-gray-600">
                              <strong>Notes :</strong> {{ appointment.notes }}
                            </p>
                          </div>
                        }
                      </div>
                    }
                  </div>
                } @else {
                  <div class="text-center py-8">
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
                    <p class="text-gray-500">
                      Ce patient n'a pas encore de rendez-vous.
                    </p>
                  </div>
                }
              </div>

              <div class="mt-6 flex justify-end">
                <button
                  (click)="closeHistoryModal()"
                  class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [],
})
export class DoctorPatientsComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);

  patients = signal<PatientSummary[]>([]);
  allAppointments = signal<Appointment[]>([]);
  isLoading = signal(false);
  showHistoryModal = signal(false);
  selectedPatient = signal<PatientSummary | null>(null);
  patientHistory = signal<Appointment[]>([]);

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

        this.allAppointments.set(allAppointments);

        const doctorAppointments = allAppointments.filter(
          (appointment) => appointment.doctor.user.id === currentUser.id,
        );

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

          const appointmentDate = new Date(appointment.date);
          const now = new Date();

          if (appointmentDate < now) {
            if (
              !patientSummary.lastAppointment ||
              appointmentDate > patientSummary.lastAppointment
            ) {
              patientSummary.lastAppointment = appointmentDate;
            }
          }

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
    const patient = this.patients().find((p) => p.patientId === patientId);
    if (patient) {
      const history = this.getPatientAppointmentHistory(patientId);

      this.selectedPatient.set(patient);
      this.patientHistory.set(history);
      this.showHistoryModal.set(true);
    }
  }

  closeHistoryModal() {
    this.showHistoryModal.set(false);
    this.selectedPatient.set(null);
    this.patientHistory.set([]);
  }

  private getPatientAppointmentHistory(patientId: number): Appointment[] {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return [];

    return this.allAppointments()
      .filter(
        (appointment) =>
          appointment.patientId === patientId &&
          appointment.doctor.user.id === currentUser.id,
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'scheduled':
        return 'Programmé';
      case 'confirmed':
        return 'Confirmé';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  }
}
