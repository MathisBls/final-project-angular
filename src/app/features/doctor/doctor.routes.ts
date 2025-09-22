import { Routes } from '@angular/router';

export const DOCTOR_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'appointments',
    pathMatch: 'full',
  },
  {
    path: 'appointments',
    loadComponent: () =>
      import(
        './components/doctor-appointments/doctor-appointments.component'
      ).then((m) => m.DoctorAppointmentsComponent),
  },
  {
    path: 'schedule',
    loadComponent: () =>
      import('./components/doctor-schedule/doctor-schedule.component').then(
        (m) => m.DoctorScheduleComponent,
      ),
  },
  {
    path: 'patients',
    loadComponent: () =>
      import('./components/doctor-patients/doctor-patients.component').then(
        (m) => m.DoctorPatientsComponent,
      ),
  },
];
