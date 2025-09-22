import { Routes } from '@angular/router';

export const APPOINTMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/appointment-list/appointment-list.component').then(
        (m) => m.AppointmentListComponent,
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./components/appointment-form/appointment-form.component').then(
        (m) => m.AppointmentFormComponent,
      ),
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import(
        './components/appointment-calendar/appointment-calendar.component'
      ).then((m) => m.AppointmentCalendarComponent),
  },
];
