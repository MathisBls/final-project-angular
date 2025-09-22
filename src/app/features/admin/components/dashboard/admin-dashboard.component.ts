import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Administration</h1>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-600">Tableau de bord administrateur</p>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class AdminDashboardComponent {}
