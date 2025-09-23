import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PatientService } from '../../../patients/services/patient.service';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { Patient } from '../../../patients/models/patient.model';
import { Appointment } from '../../../appointments/models/appointment.model';

@Component({
  selector: 'app-patient-management',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Gestion des Patients
          </h1>
          <p class="text-gray-600">Gérez tous les patients de la plateforme</p>
        </div>

        @if (isLoading()) {
          <div class="flex justify-center py-12">
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
            ></div>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                    Total patients
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">
                    Nouveaux ce mois
                  </p>
                  <p class="text-2xl font-semibold text-gray-900">
                    {{ newPatientsThisMonth }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">
                Liste des Patients
              </h3>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Patient
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Âge
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      RDV totaux
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Dernier RDV
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Statut
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  @if (patients().length > 0) {
                    @for (patient of patients(); track patient.id) {
                      <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div
                              class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4"
                            >
                              <span class="text-sm font-bold text-blue-600">
                                {{ patient.user.firstName.charAt(0)
                                }}{{ patient.user.lastName.charAt(0) }}
                              </span>
                            </div>
                            <div>
                              <div class="text-sm font-medium text-gray-900">
                                {{ patient.user.firstName }}
                                {{ patient.user.lastName }}
                              </div>
                              <div class="text-sm text-gray-500">
                                {{ patient.user.email }}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">
                            {{ patient.user.phone }}
                          </div>
                          <div class="text-sm text-gray-500">
                            {{ patient.address.city }},
                            {{ patient.address.postalCode }}
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">
                            {{ calculateAge(patient.dateOfBirth) }} ans
                          </div>
                          <div class="text-sm text-gray-500">
                            {{ patient.gender | titlecase }}
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">
                            {{ getPatientAppointmentCount(patient.id) }}
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">
                            {{
                              getLastAppointmentDate(patient.id)
                                | date: 'dd/MM/yyyy'
                            }}
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            [class.bg-green-100]="patient.user.isActive"
                            [class.text-green-800]="patient.user.isActive"
                            [class.bg-red-100]="!patient.user.isActive"
                            [class.text-red-800]="!patient.user.isActive"
                          >
                            {{ patient.user.isActive ? 'Actif' : 'Inactif' }}
                          </span>
                        </td>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                        >
                          <button
                            (click)="togglePatientStatus(patient.id)"
                            class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
                            [class.bg-red-100]="patient.user.isActive"
                            [class.text-red-800]="patient.user.isActive"
                            [class.hover:bg-red-200]="patient.user.isActive"
                            [class.bg-green-100]="!patient.user.isActive"
                            [class.text-green-800]="!patient.user.isActive"
                            [class.hover:bg-green-200]="!patient.user.isActive"
                          >
                            {{
                              patient.user.isActive ? 'Désactiver' : 'Activer'
                            }}
                          </button>
                        </td>
                      </tr>
                    }
                  } @else {
                    <tr>
                      <td
                        colspan="7"
                        class="px-6 py-12 text-center text-gray-500"
                      >
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
                        <p class="text-gray-500">
                          Aucun patient n'est enregistré sur la plateforme.
                        </p>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class PatientManagementComponent implements OnInit {
  private patientService = inject(PatientService);
  private appointmentService = inject(AppointmentService);

  patients = signal<Patient[]>([]);
  allAppointments = signal<Appointment[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.loadPatients();
  }

  async loadPatients() {
    this.isLoading.set(true);
    try {
      const [patients, appointments] = await Promise.all([
        this.patientService.getAllPatients(),
        this.appointmentService.getAllAppointments(),
      ]);

      this.patients.set(patients);
      this.allAppointments.set(appointments);
    } catch (error) {
      console.error('Erreur lors du chargement des patients:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  getPatientAppointmentCount(patientId: number): number {
    return this.allAppointments().filter((app) => app.patientId === patientId)
      .length;
  }

  getLastAppointmentDate(patientId: number): Date | null {
    const patientAppointments = this.allAppointments()
      .filter((app) => app.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return patientAppointments.length > 0
      ? new Date(patientAppointments[0].date)
      : null;
  }

  get activePatients(): number {
    return this.patients().filter((p) => p.user.isActive).length;
  }

  get monthlyAppointments(): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return this.allAppointments().filter((app) => {
      const appDate = new Date(app.date);
      return (
        appDate.getMonth() === currentMonth &&
        appDate.getFullYear() === currentYear
      );
    }).length;
  }

  get newPatientsThisMonth(): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return this.patients().filter((patient) => {
      const createdDate = new Date(patient.createdAt);
      return (
        createdDate.getMonth() === currentMonth &&
        createdDate.getFullYear() === currentYear
      );
    }).length;
  }

  async togglePatientStatus(patientId: number) {
    try {
      const patient = this.patients().find((p) => p.id === patientId);
      if (patient) {
        const newStatus = !patient.user.isActive;

        await this.patientService.updatePatient(patientId, {
          user: {
            ...patient.user,
            isActive: newStatus,
          },
        });

        this.patients.update((patients) =>
          patients.map((p) =>
            p.id === patientId
              ? { ...p, user: { ...p.user, isActive: newStatus } }
              : p,
          ),
        );
      }
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      alert('Erreur lors du changement de statut du patient');
    }
  }
}
