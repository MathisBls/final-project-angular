import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { doctorGuard } from './core/guards/doctor.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/doctors',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'doctors',
    loadChildren: () =>
      import('./features/doctors/doctors.routes').then((m) => m.DOCTORS_ROUTES),
  },
  {
    path: 'appointments',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/appointments/appointments.routes').then(
        (m) => m.APPOINTMENTS_ROUTES,
      ),
  },
  {
    path: 'doctor',
    canActivate: [authGuard, doctorGuard],
    loadChildren: () =>
      import('./features/doctor/doctor.routes').then((m) => m.DOCTOR_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/auth/components/profile/profile.component').then(
        (m) => m.ProfileComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '/doctors',
  },
];
