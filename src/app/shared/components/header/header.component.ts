import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, BreadcrumbsComponent],
  template: `
    <header class="bg-blue-600 text-white shadow-lg">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <!-- Logo et titre -->
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-bold">🏥 Doctolib</h1>
            <span class="text-sm opacity-75"
              >Prenez rendez-vous facilement</span
            >
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex space-x-6">
            <!-- Navigation publique -->
            <a
              routerLink="/doctors"
              class="hover:text-blue-200 transition-colors px-3 py-2 rounded-md"
              [class.bg-blue-700]="isActiveRoute('/doctors')"
              [class.text-blue-100]="isActiveRoute('/doctors')"
            >
              Médecins
            </a>
            <a
              routerLink="/specialities"
              class="hover:text-blue-200 transition-colors px-3 py-2 rounded-md"
              [class.bg-blue-700]="isActiveRoute('/specialities')"
              [class.text-blue-100]="isActiveRoute('/specialities')"
            >
              Spécialités
            </a>

            @if (currentUser()) {
              <!-- Navigation pour utilisateur connecté -->
              <a
                routerLink="/dashboard"
                class="hover:text-blue-200 transition-colors px-3 py-2 rounded-md"
                [class.bg-blue-700]="isActiveRoute('/dashboard')"
                [class.text-blue-100]="isActiveRoute('/dashboard')"
              >
                Dashboard
              </a>

              @if (currentUser()?.role === 'patient') {
                <a
                  routerLink="/appointments"
                  class="hover:text-blue-200 transition-colors px-3 py-2 rounded-md"
                  [class.bg-blue-700]="isActiveRoute('/appointments')"
                  [class.text-blue-100]="isActiveRoute('/appointments')"
                >
                  Mes Rendez-vous
                </a>
              }

              @if (currentUser()?.role === 'doctor') {
                <a
                  routerLink="/doctor/appointments"
                  class="hover:text-blue-200 transition-colors px-3 py-2 rounded-md"
                  [class.bg-blue-700]="isActiveRoute('/doctor/appointments')"
                  [class.text-blue-100]="isActiveRoute('/doctor/appointments')"
                >
                  Mes Rendez-vous
                </a>
                <a
                  routerLink="/doctor/patients"
                  class="hover:text-blue-200 transition-colors px-3 py-2 rounded-md"
                  [class.bg-blue-700]="isActiveRoute('/doctor/patients')"
                  [class.text-blue-100]="isActiveRoute('/doctor/patients')"
                >
                  Mes Patients
                </a>
                <a
                  routerLink="/doctor/schedule"
                  class="hover:text-blue-200 transition-colors px-3 py-2 rounded-md"
                  [class.bg-blue-700]="isActiveRoute('/doctor/schedule')"
                  [class.text-blue-100]="isActiveRoute('/doctor/schedule')"
                >
                  Planning
                </a>
              }

              @if (currentUser()?.role === 'admin') {
                <a
                  routerLink="/admin"
                  class="hover:text-blue-200 transition-colors px-3 py-2 rounded-md"
                  [class.bg-blue-700]="isActiveRoute('/admin')"
                  [class.text-blue-100]="isActiveRoute('/admin')"
                >
                  Administration
                </a>
              }

              <!-- Menu utilisateur -->
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <div
                    class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <span class="text-sm font-medium">
                      {{ currentUser()?.firstName?.charAt(0)
                      }}{{ currentUser()?.lastName?.charAt(0) }}
                    </span>
                  </div>
                  <a
                    routerLink="/profile"
                    class="text-sm hover:text-blue-200 transition-colors cursor-pointer"
                  >
                    {{ currentUser()?.firstName }} {{ currentUser()?.lastName }}
                  </a>
                </div>

                <!-- Bouton de déconnexion visible -->
                <button
                  (click)="logout()"
                  class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            } @else {
              <!-- Navigation pour utilisateur non connecté -->
              <a
                routerLink="/auth/login"
                class="hover:text-blue-200 transition-colors"
              >
                Connexion
              </a>
              <a
                routerLink="/auth/register"
                class="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                S'inscrire
              </a>
            }
          </nav>

          <!-- Menu mobile -->
          <div class="md:hidden">
            <button
              (click)="toggleMobileMenu()"
              class="text-white hover:text-blue-200 transition-colors"
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
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Menu mobile déroulant -->
        @if (showMobileMenu()) {
          <div class="md:hidden mt-4 pb-4 border-t border-blue-500">
            <div class="pt-4 space-y-2">
              <!-- Navigation publique -->
              <a
                routerLink="/doctors"
                class="block py-2 hover:text-blue-200 transition-colors"
              >
                Médecins
              </a>
              <a
                routerLink="/specialities"
                class="block py-2 hover:text-blue-200 transition-colors"
              >
                Spécialités
              </a>

              @if (currentUser()) {
                <hr class="my-2 border-blue-500" />
                <a
                  routerLink="/dashboard"
                  class="block py-2 hover:text-blue-200 transition-colors"
                >
                  Dashboard
                </a>
                @if (currentUser()?.role === 'patient') {
                  <a
                    routerLink="/appointments"
                    class="block py-2 hover:text-blue-200 transition-colors"
                  >
                    Mes Rendez-vous
                  </a>
                }
                @if (currentUser()?.role === 'doctor') {
                  <a
                    routerLink="/doctor/appointments"
                    class="block py-2 hover:text-blue-200 transition-colors"
                  >
                    Mes Rendez-vous
                  </a>
                  <a
                    routerLink="/doctor/patients"
                    class="block py-2 hover:text-blue-200 transition-colors"
                  >
                    Mes Patients
                  </a>
                  <a
                    routerLink="/doctor/schedule"
                    class="block py-2 hover:text-blue-200 transition-colors"
                  >
                    Planning
                  </a>
                }
                @if (currentUser()?.role === 'admin') {
                  <a
                    routerLink="/admin"
                    class="block py-2 hover:text-blue-200 transition-colors"
                  >
                    Administration
                  </a>
                }
                <a
                  routerLink="/profile"
                  class="block py-2 hover:text-blue-200 transition-colors"
                >
                  Mon Profil
                </a>
                <div class="pt-2">
                  <button
                    (click)="logout()"
                    class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Déconnexion
                  </button>
                </div>
              } @else {
                <hr class="my-2 border-blue-500" />
                <a
                  routerLink="/auth/login"
                  class="block py-2 hover:text-blue-200 transition-colors"
                >
                  Connexion
                </a>
                <a
                  routerLink="/auth/register"
                  class="block py-2 hover:text-blue-200 transition-colors"
                >
                  S'inscrire
                </a>
              }
            </div>
          </div>
        }

        <!-- Breadcrumbs -->
        <app-breadcrumbs />
      </div>
    </header>
  `,
  styles: [],
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private navigationService = inject(NavigationService);

  currentUser = this.authService.currentUserSignal;
  showMobileMenu = signal(false);

  toggleMobileMenu() {
    this.showMobileMenu.update((show) => !show);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/doctors']);
    this.showMobileMenu.set(false);
  }

  isActiveRoute(route: string): boolean {
    return this.navigationService.isActiveRoute(route);
  }
}
