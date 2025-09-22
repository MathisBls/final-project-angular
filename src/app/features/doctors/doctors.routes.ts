import { Routes } from '@angular/router';

export const DOCTORS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/doctor-list/doctor-list.component').then(
        (m) => m.DoctorListComponent,
      ),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./components/doctor-search/doctor-search.component').then(
        (m) => m.DoctorSearchComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/doctor-detail/doctor-detail.component').then(
        (m) => m.DoctorDetailComponent,
      ),
  },
];
