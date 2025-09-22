import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/services/auth.service';
import { DoctorService } from '../doctors/services/doctor.service';
import { AppointmentService } from '../appointments/services/appointment.service';
import { Appointment } from '../appointments/models/appointment.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <!-- En-tête du dashboard -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue, {{ currentUser()?.firstName }}
            {{ currentUser()?.lastName }} !
          </h1>
          <p class="text-gray-600">
            @if (currentUser()?.role === 'patient') {
              Gérez vos rendez-vous médicaux facilement
            } @else if (currentUser()?.role === 'doctor') {
              Gérez votre planning et vos patients
            } @else if (currentUser()?.role === 'admin') {
              Administrez la plateforme Doctolib
            }
          </p>
        </div>

        <!-- Statistiques rapides -->
        @if (isLoading()) {
          <div class="flex justify-center py-12">
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
            ></div>
          </div>
        } @else {
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            @if (currentUser()?.role === 'patient') {
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
                      Rendez-vous à venir
                    </p>
                    <p class="text-2xl font-semibold text-gray-900">
                      {{ upcomingAppointments() }}
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
                      Rendez-vous passés
                    </p>
                    <p class="text-2xl font-semibold text-gray-900">
                      {{ pastAppointments() }}
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      ></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">
                      Médecins consultés
                    </p>
                    <p class="text-2xl font-semibold text-gray-900">
                      {{ consultedDoctors() }}
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
                      Prochain RDV
                    </p>
                    <p class="text-sm font-semibold text-gray-900">
                      {{ nextAppointmentDate() }}
                    </p>
                  </div>
                </div>
              </div>
            }

            @if (currentUser()?.role === 'doctor') {
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
                      Rendez-vous aujourd'hui
                    </p>
                    <p class="text-2xl font-semibold text-gray-900">
                      {{ todayAppointments() }}
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      ></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">
                      Patients totaux
                    </p>
                    <p class="text-2xl font-semibold text-gray-900">
                      {{ totalPatients() }}
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      ></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">
                      Note moyenne
                    </p>
                    <p class="text-2xl font-semibold text-gray-900">
                      {{ averageRating() }}/5
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      ></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">
                      Revenus du mois
                    </p>
                    <p class="text-2xl font-semibold text-gray-900">
                      {{ monthlyRevenue() }}€
                    </p>
                  </div>
                </div>
              </div>
            }

            @if (currentUser()?.role === 'admin') {
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
                      Utilisateurs totaux
                    </p>
                    <p class="text-2xl font-semibold text-gray-900">
                      {{ totalUsers() }}
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
                      Médecins actifs
                    </p>
                    <p class="text-2xl font-semibold text-gray-900">
                      {{ activeDoctors() }}
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
                    <p class="text-sm font-medium text-gray-600">
                      Rendez-vous du jour
                    </p>
                    <p class="text-2xl font-semibold text-gray-900">
                      {{ todayAppointments() }}
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      ></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">
                      Revenus totaux
                    </p>
                    <p class="text-2xl font-semibold text-gray-900">
                      {{ totalRevenue() }}€
                    </p>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        <!-- Actions rapides -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Actions selon le rôle -->
          @if (currentUser()?.role === 'patient') {
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Actions rapides
              </h3>
              <div class="space-y-3">
                <a
                  routerLink="/doctors"
                  class="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <svg
                    class="w-5 h-5 text-blue-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                  <span class="text-blue-800 font-medium"
                    >Trouver un médecin</span
                  >
                </a>
                <a
                  routerLink="/appointments"
                  class="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <svg
                    class="w-5 h-5 text-green-600 mr-3"
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
                  <span class="text-green-800 font-medium"
                    >Mes rendez-vous</span
                  >
                </a>
                <a
                  routerLink="/profile"
                  class="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <svg
                    class="w-5 h-5 text-purple-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  <span class="text-purple-800 font-medium">Mon profil</span>
                </a>
              </div>
            </div>
          }

          @if (currentUser()?.role === 'doctor') {
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Actions rapides
              </h3>
              <div class="space-y-3">
                <a
                  routerLink="/doctor/appointments"
                  class="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <svg
                    class="w-5 h-5 text-blue-600 mr-3"
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
                  <span class="text-blue-800 font-medium">Mes rendez-vous</span>
                </a>
                <a
                  routerLink="/doctor/schedule"
                  class="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <svg
                    class="w-5 h-5 text-green-600 mr-3"
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
                  <span class="text-green-800 font-medium">Mon planning</span>
                </a>
                <a
                  routerLink="/profile"
                  class="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <svg
                    class="w-5 h-5 text-purple-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  <span class="text-purple-800 font-medium">Mon profil</span>
                </a>
              </div>
            </div>
          }

          @if (currentUser()?.role === 'admin') {
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Actions rapides
              </h3>
              <div class="space-y-3">
                <a
                  routerLink="/admin"
                  class="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <svg
                    class="w-5 h-5 text-blue-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                  <span class="text-blue-800 font-medium">Administration</span>
                </a>
                <a
                  routerLink="/admin/doctors"
                  class="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <svg
                    class="w-5 h-5 text-green-600 mr-3"
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
                  <span class="text-green-800 font-medium"
                    >Gérer les médecins</span
                  >
                </a>
                <a
                  routerLink="/admin/patients"
                  class="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <svg
                    class="w-5 h-5 text-purple-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    ></path>
                  </svg>
                  <span class="text-purple-800 font-medium"
                    >Gérer les patients</span
                  >
                </a>
              </div>
            </div>
          }

          <!-- Rendez-vous récents -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Rendez-vous récents
            </h3>
            <div class="space-y-3">
              @if (recentAppointments().length > 0) {
                @for (
                  appointment of recentAppointments();
                  track appointment.id
                ) {
                  <div
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p class="font-medium text-gray-900">
                        @if (currentUser()?.role === 'patient') {
                          Dr. {{ appointment.doctor.user.firstName }}
                          {{ appointment.doctor.user.lastName }}
                        } @else {
                          {{ appointment.patient.user.firstName }}
                          {{ appointment.patient.user.lastName }}
                        }
                      </p>
                      <p class="text-sm text-gray-600">
                        {{ appointment.date | date: 'dd/MM/yyyy' }} à
                        {{ appointment.time }}
                      </p>
                    </div>
                    <span
                      class="px-2 py-1 text-xs font-semibold rounded-full"
                      [class.bg-yellow-100]="appointment.status === 'scheduled'"
                      [class.text-yellow-800]="
                        appointment.status === 'scheduled'
                      "
                      [class.bg-green-100]="appointment.status === 'confirmed'"
                      [class.text-green-800]="
                        appointment.status === 'confirmed'
                      "
                      [class.bg-blue-100]="appointment.status === 'completed'"
                      [class.text-blue-800]="appointment.status === 'completed'"
                    >
                      {{ appointment.status | titlecase }}
                    </span>
                  </div>
                }
              } @else {
                <p class="text-gray-500 text-center py-4">
                  Aucun rendez-vous récent
                </p>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private doctorService = inject(DoctorService);
  private appointmentService = inject(AppointmentService);

  currentUser = this.authService.currentUserSignal;
  allAppointments = signal<Appointment[]>([]);
  isLoading = signal(true);

  // Données calculées pour le dashboard
  upcomingAppointments = signal(0);
  pastAppointments = signal(0);
  consultedDoctors = signal(0);
  nextAppointmentDate = signal('Aucun RDV');

  todayAppointments = signal(0);
  totalPatients = signal(0);
  averageRating = signal(0);
  monthlyRevenue = signal(0);

  totalUsers = signal(0);
  activeDoctors = signal(0);
  totalRevenue = signal(0);

  recentAppointments = signal<Appointment[]>([]);

  ngOnInit() {
    this.loadDashboardData();
  }

  async loadDashboardData() {
    this.isLoading.set(true);
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) return;

      const appointments = await this.appointmentService.getAllAppointments();
      this.allAppointments.set(appointments);

      if (currentUser.role === 'patient') {
        await this.loadPatientDashboard(appointments, currentUser.id);
      } else if (currentUser.role === 'doctor') {
        await this.loadDoctorDashboard(appointments, currentUser.id);
      } else if (currentUser.role === 'admin') {
        await this.loadAdminDashboard(appointments);
      }
    } catch (error) {
      console.error(
        'Erreur lors du chargement des données du dashboard:',
        error,
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  private async loadPatientDashboard(
    appointments: Appointment[],
    patientId: number,
  ) {
    const userAppointments = appointments.filter(
      (app) => app.patientId === patientId,
    );

    const now = new Date();
    const upcoming = userAppointments.filter(
      (app) =>
        new Date(app.date) > now &&
        (app.status === 'scheduled' || app.status === 'confirmed'),
    );
    const past = userAppointments.filter(
      (app) => new Date(app.date) <= now || app.status === 'completed',
    );

    this.upcomingAppointments.set(upcoming.length);
    this.pastAppointments.set(past.length);

    // Médecins consultés (unique)
    const uniqueDoctors = new Set(userAppointments.map((app) => app.doctorId));
    this.consultedDoctors.set(uniqueDoctors.size);

    // Prochain RDV
    const nextAppointment = upcoming.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )[0];
    if (nextAppointment) {
      const appointmentDate = new Date(nextAppointment.date);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      if (appointmentDate.toDateString() === today.toDateString()) {
        this.nextAppointmentDate.set(`Aujourd'hui ${nextAppointment.time}`);
      } else if (appointmentDate.toDateString() === tomorrow.toDateString()) {
        this.nextAppointmentDate.set(`Demain ${nextAppointment.time}`);
      } else {
        this.nextAppointmentDate.set(
          `${appointmentDate.toLocaleDateString()} ${nextAppointment.time}`,
        );
      }
    } else {
      this.nextAppointmentDate.set('Aucun RDV');
    }

    this.recentAppointments.set(userAppointments.slice(0, 5));
  }

  private async loadDoctorDashboard(
    appointments: Appointment[],
    doctorId: number,
  ) {
    const doctorAppointments = appointments.filter(
      (app) => app.doctorId === doctorId,
    );

    const today = new Date();
    const todayAppointments = doctorAppointments.filter((app) => {
      const appDate = new Date(app.date);
      return appDate.toDateString() === today.toDateString();
    });

    this.todayAppointments.set(todayAppointments.length);

    // Patients uniques
    const uniquePatients = new Set(
      doctorAppointments.map((app) => app.patientId),
    );
    this.totalPatients.set(uniquePatients.size);

    // Note moyenne (simulée pour l'instant)
    this.averageRating.set(4.8);

    // Revenus du mois
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyAppointments = doctorAppointments.filter((app) => {
      const appDate = new Date(app.date);
      return (
        appDate.getMonth() === currentMonth &&
        appDate.getFullYear() === currentYear &&
        app.status === 'completed'
      );
    });

    this.monthlyRevenue.set(
      monthlyAppointments.reduce(
        (total, app) => total + (app.doctor?.consultationFee || 0),
        0,
      ),
    );

    this.recentAppointments.set(doctorAppointments.slice(0, 5));
  }

  private async loadAdminDashboard(appointments: Appointment[]) {
    const users = await this.authService.getAllUsers();
    const doctors = await this.doctorService.getAllDoctors();

    this.totalUsers.set(users.length);
    this.activeDoctors.set(doctors.filter((d) => d.isAvailable).length);

    const today = new Date();
    const todayAppointments = appointments.filter((app) => {
      const appDate = new Date(app.date);
      return appDate.toDateString() === today.toDateString();
    });
    this.todayAppointments.set(todayAppointments.length);

    // Revenus totaux
    const completedAppointments = appointments.filter(
      (app) => app.status === 'completed',
    );
    this.totalRevenue.set(
      completedAppointments.reduce(
        (total, app) => total + (app.doctor?.consultationFee || 0),
        0,
      ),
    );

    this.recentAppointments.set(appointments.slice(0, 5));
  }
}
