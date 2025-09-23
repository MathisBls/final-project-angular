import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';
import { PricePipe, StatusLabelPipe } from '../../../../shared/pipes';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PricePipe, StatusLabelPipe],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Médecins Disponibles
          </h1>
          <p class="text-gray-600">Trouvez le médecin qui vous convient</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (doctor of doctors(); track doctor.id) {
            <div
              class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <div
                    class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4"
                  >
                    <span class="text-2xl font-bold text-blue-600">
                      {{ doctor.user.firstName.charAt(0)
                      }}{{ doctor.user.lastName.charAt(0) }}
                    </span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">
                      <a
                        [routerLink]="['/doctors', doctor.id]"
                        class="hover:text-blue-600 transition-colors"
                      >
                        {{ doctor.user.firstName }} {{ doctor.user.lastName }}
                      </a>
                    </h3>
                    <p class="text-blue-600 font-medium">
                      {{ doctor.speciality }}
                    </p>
                  </div>
                </div>

                <div class="space-y-2 mb-4">
                  <div class="flex items-center text-sm text-gray-600">
                    <svg
                      class="w-4 h-4 mr-2"
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
                    {{ doctor.experience }} ans d'expérience
                  </div>
                  <div class="flex items-center text-sm text-gray-600">
                    <svg
                      class="w-4 h-4 mr-2"
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
                    {{ doctor.consultationFee | price }} la consultation
                  </div>
                  <div class="flex items-center text-sm text-gray-600">
                    <svg
                      class="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      ></path>
                    </svg>
                    {{ doctor.rating }}/5 ({{ doctor.totalReviews }} avis)
                  </div>
                </div>

                <p class="text-sm text-gray-600 mb-4 line-clamp-2">
                  {{ doctor.bio }}
                </p>

                <div class="flex items-center justify-between">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    [class.bg-green-100]="doctor.isAvailable"
                    [class.text-green-800]="doctor.isAvailable"
                    [class.bg-red-100]="!doctor.isAvailable"
                    [class.text-red-800]="!doctor.isAvailable"
                  >
                    {{
                      (doctor.isAvailable ? 'active' : 'inactive') | statusLabel
                    }}
                  </span>
                  <a
                    [routerLink]="['/doctors', doctor.id]"
                    class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium inline-block"
                  >
                    Voir le profil
                  </a>
                </div>
              </div>
            </div>
          }
        </div>

        @if (doctors().length === 0) {
          <div class="text-center py-12">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
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
            <h3 class="mt-2 text-sm font-medium text-gray-900">
              Aucun médecin trouvé
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Essayez de modifier vos critères de recherche.
            </p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class DoctorListComponent implements OnInit {
  private doctorService = inject(DoctorService);
  doctors = signal<Doctor[]>([]);

  ngOnInit() {
    this.loadDoctors();
  }

  private async loadDoctors() {
    try {
      const doctors = await this.doctorService.getAllDoctors();
      this.doctors.set(doctors);
    } catch (error) {
      console.error('Erreur lors du chargement des médecins:', error);
    }
  }
}
