import { Injectable, signal, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private router = inject(Router);

  currentRoute = signal('');
  breadcrumbs = signal<{ label: string; url: string }[]>([]);

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute.set(event.url);
        this.generateBreadcrumbs(event.url);
      });
  }

  generateBreadcrumbs(url: string) {
    const segments = url.split('/').filter((segment) => segment);
    const breadcrumbs: { label: string; url: string }[] = [];

    let currentUrl = '';

    segments.forEach((segment, index) => {
      currentUrl += `/${segment}`;
      let label = segment;

      switch (segment) {
        case 'dashboard':
          label = 'Tableau de bord';
          break;
        case 'doctors':
          label = 'Médecins';
          break;
        case 'appointments':
          label = 'Rendez-vous';
          break;
        case 'profile':
          label = 'Profil';
          break;
        case 'admin':
          label = 'Administration';
          break;
        case 'auth':
          if (segments[index + 1] === 'login') {
            label = 'Connexion';
            currentUrl = '/auth/login';
          } else if (segments[index + 1] === 'register') {
            label = 'Inscription';
            currentUrl = '/auth/register';
          }
          break;
        case 'doctor':
          if (segments[index + 1] === 'appointments') {
            label = 'Mes Patients';
            currentUrl = '/doctor/appointments';
          } else if (segments[index + 1] === 'schedule') {
            label = 'Planning';
            currentUrl = '/doctor/schedule';
          }
          break;
      }

      breadcrumbs.push({ label, url: currentUrl });
    });

    this.breadcrumbs.set(breadcrumbs);
  }

  isActiveRoute(route: string): boolean {
    return this.currentRoute().startsWith(route);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
