import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loadingService.isLoading()) {
      <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          class="bg-white rounded-lg p-6 shadow-xl flex items-center space-x-4"
        >
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          ></div>
          <div class="text-gray-700">
            <p class="font-medium">Chargement...</p>
            <p class="text-sm text-gray-500">
              Veuillez patienter pendant le traitement de votre demande.
            </p>
          </div>
        </div>
      </div>
    }
  `,
  styles: [],
})
export class LoadingComponent {
  loadingService = inject(LoadingService);
}
