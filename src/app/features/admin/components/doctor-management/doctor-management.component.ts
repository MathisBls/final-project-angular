import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { Doctor } from '../../../doctors/models/doctor.model';

@Component({
  selector: 'app-doctor-management',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Gestion des Médecins</h1>
          <a
            routerLink="/admin/doctors/create"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            + Ajouter un médecin
          </a>
        </div>

        @if (isLoading()) {
          <div class="flex justify-center py-12">
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
            ></div>
          </div>
        } @else {
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Médecin
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Spécialité
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Expérience
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tarif
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Statut
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  @for (doctor of doctors(); track doctor.id) {
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-10 w-10">
                            <div
                              class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"
                            >
                              <span class="text-sm font-medium text-blue-600">
                                {{ doctor.user.firstName.charAt(0)
                                }}{{ doctor.user.lastName.charAt(0) }}
                              </span>
                            </div>
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">
                              {{ doctor.user.firstName }}
                              {{ doctor.user.lastName }}
                            </div>
                            <div class="text-sm text-gray-500">
                              {{ doctor.user.email }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {{ doctor.speciality }}
                        </span>
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {{ doctor.experience }} ans
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {{ doctor.consultationFee }}€
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          [class.bg-green-100]="doctor.user.isActive"
                          [class.text-green-800]="doctor.user.isActive"
                          [class.bg-red-100]="!doctor.user.isActive"
                          [class.text-red-800]="!doctor.user.isActive"
                        >
                          {{ doctor.user.isActive ? 'Actif' : 'Inactif' }}
                        </span>
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                      >
                        <div class="flex space-x-2">
                          <button
                            (click)="viewDoctorProfile(doctor.id)"
                            class="px-3 py-1 rounded-md text-sm font-medium transition-colors bg-blue-100 text-blue-800 hover:bg-blue-200"
                          >
                            Voir profil
                          </button>
                          <button
                            (click)="toggleDoctorStatus(doctor.id)"
                            class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
                            [class.bg-red-100]="doctor.user.isActive"
                            [class.text-red-800]="doctor.user.isActive"
                            [class.hover:bg-red-200]="doctor.user.isActive"
                            [class.bg-green-100]="!doctor.user.isActive"
                            [class.text-green-800]="!doctor.user.isActive"
                            [class.hover:bg-green-200]="!doctor.user.isActive"
                          >
                            {{
                              doctor.user.isActive ? 'Désactiver' : 'Activer'
                            }}
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
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
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">
                  Aucun médecin
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  Commencez par ajouter un médecin.
                </p>
                <div class="mt-6">
                  <a
                    routerLink="/admin/doctors/create"
                    class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    + Ajouter un médecin
                  </a>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class DoctorManagementComponent implements OnInit {
  private doctorService = inject(DoctorService);

  doctors = signal<Doctor[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.loadDoctors();
  }

  async loadDoctors() {
    this.isLoading.set(true);
    try {
      const doctors = await this.doctorService.getAllDoctors();
      this.doctors.set(doctors);
    } catch (error) {
      console.error('Erreur lors du chargement des médecins:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  viewDoctorProfile(doctorId: number) {
    console.log('Voir profil du médecin:', doctorId);
    // TODO: Implémenter la navigation vers le profil du médecin
    // Pour l'instant, on peut rediriger vers la page de détail du médecin
    window.open(`/doctors/${doctorId}`, '_blank');
  }

  async toggleDoctorStatus(doctorId: number) {
    try {
      const doctor = this.doctors().find((d) => d.id === doctorId);
      if (doctor) {
        const newStatus = !doctor.user.isActive;

        await this.doctorService.updateDoctor(doctorId, {
          user: {
            ...doctor.user,
            isActive: newStatus,
          },
        });

        // Mettre à jour immédiatement l'affichage
        this.doctors.update((doctors) =>
          doctors.map((d) =>
            d.id === doctorId
              ? { ...d, user: { ...d.user, isActive: newStatus } }
              : d,
          ),
        );

        console.log(
          `Médecin ${doctor.user.firstName} ${doctor.user.lastName} ${newStatus ? 'activé' : 'désactivé'} avec succès`,
        );
      }
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      alert('Erreur lors du changement de statut du médecin');
    }
  }
}
