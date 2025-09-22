import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent,
      ),
  },
  {
    path: 'doctors',
    loadComponent: () =>
      import('./components/doctor-management/doctor-management.component').then(
        (m) => m.DoctorManagementComponent,
      ),
  },
  {
    path: 'doctors/create',
    loadComponent: () =>
      import('./components/doctor-creation/doctor-creation.component').then(
        (m) => m.DoctorCreationComponent,
      ),
  },
  {
    path: 'patients',
    loadComponent: () =>
      import(
        './components/patient-management/patient-management.component'
      ).then((m) => m.PatientManagementComponent),
  },
];
