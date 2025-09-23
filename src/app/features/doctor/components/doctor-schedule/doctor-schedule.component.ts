import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Appointment } from '../../../appointments/models/appointment.model';

interface DaySchedule {
  date: Date;
  appointments: Appointment[];
  isToday: boolean;
  isPast: boolean;
}

@Component({
  selector: 'app-doctor-schedule',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Mon Planning</h1>
          <p class="text-gray-600">
            Gérez votre planning et vos créneaux disponibles
          </p>
        </div>

        @if (isLoading()) {
          <div class="flex justify-center py-12">
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
            ></div>
          </div>
        } @else {
          <!-- Navigation des semaines -->
          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <div class="flex items-center justify-between">
              <button
                (click)="previousWeek()"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
              </button>

              <h2 class="text-lg font-semibold text-gray-900">
                {{ getWeekRange() }}
              </h2>

              <button
                (click)="nextWeek()"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Planning hebdomadaire -->
          <div class="grid grid-cols-1 lg:grid-cols-7 gap-4">
            @for (day of weekSchedule(); track day.date.getTime()) {
              <div class="bg-white rounded-lg shadow">
                <!-- En-tête du jour -->
                <div
                  class="p-4 border-b"
                  [class.bg-blue-50]="day.isToday"
                  [class.border-blue-200]="day.isToday"
                >
                  <h3 class="font-semibold text-gray-900">
                    {{ day.date | date: 'EEE' }}
                  </h3>
                  <p class="text-sm text-gray-600">
                    {{ day.date | date: 'dd/MM' }}
                  </p>
                  @if (day.isToday) {
                    <span
                      class="inline-block mt-1 px-2 py-1 bg-blue-600 text-white text-xs rounded-full"
                    >
                      Aujourd'hui
                    </span>
                  }
                </div>

                <!-- Liste des rendez-vous -->
                <div class="p-4">
                  @if (day.appointments.length > 0) {
                    <div class="space-y-2">
                      @for (
                        appointment of day.appointments;
                        track appointment.id
                      ) {
                        <div
                          class="p-3 rounded-md text-sm"
                          [class.bg-yellow-50]="
                            appointment.status === 'scheduled'
                          "
                          [class.border-l-4]="
                            appointment.status === 'scheduled'
                          "
                          [class.border-yellow-400]="
                            appointment.status === 'scheduled'
                          "
                          [class.bg-green-50]="
                            appointment.status === 'confirmed'
                          "
                          [class.border-l-4]="
                            appointment.status === 'confirmed'
                          "
                          [class.border-green-400]="
                            appointment.status === 'confirmed'
                          "
                          [class.bg-blue-50]="
                            appointment.status === 'completed'
                          "
                          [class.border-l-4]="
                            appointment.status === 'completed'
                          "
                          [class.border-blue-400]="
                            appointment.status === 'completed'
                          "
                        >
                          <div class="font-medium text-gray-900">
                            {{ appointment.time }}
                          </div>
                          <div class="text-gray-600">
                            {{ appointment.patient.user.firstName }}
                            {{ appointment.patient.user.lastName }}
                          </div>
                          <div class="text-xs text-gray-500">
                            {{ appointment.reason }}
                          </div>
                          <div class="mt-1">
                            <span
                              class="inline-block px-2 py-1 text-xs rounded-full"
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
                            >
                              @if (appointment.status === 'scheduled') {
                                Programmé
                              } @else if (appointment.status === 'confirmed') {
                                Confirmé
                              } @else if (appointment.status === 'completed') {
                                Terminé
                              }
                            </span>
                          </div>
                        </div>
                      }
                    </div>
                  } @else {
                    <div class="text-center py-8 text-gray-500">
                      <svg
                        class="mx-auto h-8 w-8 mb-2"
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
                      <p class="text-sm">Aucun rendez-vous</p>
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Statistiques de la semaine -->
          <div class="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">
                    RDV cette semaine
                  </p>
                  <p class="text-2xl font-semibold text-gray-900">
                    {{ weeklyAppointments }}
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
                  <p class="text-sm font-medium text-gray-600">RDV confirmés</p>
                  <p class="text-2xl font-semibold text-gray-900">
                    {{ confirmedAppointments }}
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
                    RDV programmés
                  </p>
                  <p class="text-2xl font-semibold text-gray-900">
                    {{ scheduledAppointments }}
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    ></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">
                    Revenus semaine
                  </p>
                  <p class="text-2xl font-semibold text-gray-900">
                    {{ weeklyRevenue }}€
                  </p>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class DoctorScheduleComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);

  appointments = signal<Appointment[]>([]);
  weekSchedule = signal<DaySchedule[]>([]);
  currentWeekStart = signal<Date>(this.getWeekStart(new Date()));
  isLoading = signal(false);

  ngOnInit() {
    this.loadAppointments();
  }

  private getWeekStart(date: Date): Date {
    const weekStart = new Date(date);
    const day = weekStart.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Lundi = début de semaine
    weekStart.setDate(weekStart.getDate() + diff);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
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
        this.generateWeekSchedule();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  generateWeekSchedule() {
    const weekStart = this.currentWeekStart();
    const schedule: DaySchedule[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      date.setHours(0, 0, 0, 0);

      const dayAppointments = this.appointments().filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        appointmentDate.setHours(0, 0, 0, 0);

        return appointmentDate.getTime() === date.getTime();
      });

      schedule.push({
        date,
        appointments: dayAppointments.sort((a, b) =>
          a.time.localeCompare(b.time),
        ),
        isToday: date.getTime() === today.getTime(),
        isPast: date < today,
      });
    }

    this.weekSchedule.set(schedule);
  }

  previousWeek() {
    const currentStart = this.currentWeekStart();
    const newWeekStart = new Date(currentStart);
    newWeekStart.setDate(currentStart.getDate() - 7);
    this.currentWeekStart.set(newWeekStart);
    this.generateWeekSchedule();
  }

  nextWeek() {
    const currentStart = this.currentWeekStart();
    const newWeekStart = new Date(currentStart);
    newWeekStart.setDate(currentStart.getDate() + 7);
    this.currentWeekStart.set(newWeekStart);
    this.generateWeekSchedule();
  }

  getWeekRange(): string {
    const start = this.currentWeekStart();
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return `${start.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} - ${end.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
  }

  get weeklyAppointments(): number {
    return this.weekSchedule().reduce(
      (total, day) => total + day.appointments.length,
      0,
    );
  }

  get confirmedAppointments(): number {
    return this.weekSchedule().reduce(
      (total, day) =>
        total +
        day.appointments.filter((app) => app.status === 'confirmed').length,
      0,
    );
  }

  get scheduledAppointments(): number {
    return this.weekSchedule().reduce(
      (total, day) =>
        total +
        day.appointments.filter((app) => app.status === 'scheduled').length,
      0,
    );
  }

  get weeklyRevenue(): number {
    return this.weekSchedule().reduce(
      (total, day) =>
        total +
        day.appointments.reduce(
          (dayTotal, app) => dayTotal + app.doctor.consultationFee,
          0,
        ),
      0,
    );
  }
}
