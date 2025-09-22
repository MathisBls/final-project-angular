import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
              class="hover:text-blue-200 transition-colors"
            >
              Médecins
            </a>
            <a
              routerLink="/specialities"
              class="hover:text-blue-200 transition-colors"
            >
              Spécialités
            </a>
            <a
              routerLink="/about"
              class="hover:text-blue-200 transition-colors"
            >
              À propos
            </a>

            @if (currentUser()) {
              <!-- Navigation pour utilisateur connecté -->
              <a
                routerLink="/dashboard"
                class="hover:text-blue-200 transition-colors"
              >
                Dashboard
              </a>

              @if (currentUser()?.role === 'patient') {
                <a
                  routerLink="/appointments"
                  class="hover:text-blue-200 transition-colors"
                >
                  Mes Rendez-vous
                </a>
              }

              @if (currentUser()?.role === 'doctor') {
                <a
                  routerLink="/doctor/appointments"
                  class="hover:text-blue-200 transition-colors"
                >
                  Mes Patients
                </a>
                <a
                  routerLink="/doctor/schedule"
                  class="hover:text-blue-200 transition-colors"
                >
                  Planning
                </a>
              }

              @if (currentUser()?.role === 'admin') {
                <a
                  routerLink="/admin"
                  class="hover:text-blue-200 transition-colors"
                >
                  Administration
                </a>
              }

              <!-- Menu utilisateur -->
              <div class="relative group">
                <button
                  class="flex items-center space-x-2 hover:text-blue-200 transition-colors"
                >
                  <div
                    class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <span class="text-sm font-medium">
                      {{ currentUser()?.firstName?.charAt(0)
                      }}{{ currentUser()?.lastName?.charAt(0) }}
                    </span>
                  </div>
                  <span
                    >{{ currentUser()?.firstName }}
                    {{ currentUser()?.lastName }}</span
                  >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>

                <!-- Dropdown menu -->
                <div
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                >
                  <div class="py-1">
                    <a
                      routerLink="/profile"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Mon Profil
                    </a>
                    <a
                      routerLink="/settings"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Paramètres
                    </a>
                    <hr class="my-1" />
                    <button
                      (click)="logout()"
                      class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
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
              <a
                routerLink="/about"
                class="block py-2 hover:text-blue-200 transition-colors"
              >
                À propos
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
                <button
                  (click)="logout()"
                  class="block w-full text-left py-2 text-red-300 hover:text-red-200 transition-colors"
                >
                  Déconnexion
                </button>
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
      </div>
    </header>
  `,
  styles: [],
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.getCurrentUser;
  showMobileMenu = signal(false);

  toggleMobileMenu() {
    this.showMobileMenu.update((show) => !show);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
    this.showMobileMenu.set(false);
  }
}
