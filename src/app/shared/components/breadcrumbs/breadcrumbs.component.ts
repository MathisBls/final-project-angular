import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (breadcrumbs().length > 0) {
      <div class="mt-2 pt-2 border-t border-blue-500">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2 text-sm">
            <li>
              <a
                routerLink="/"
                class="text-blue-200 hover:text-white transition-colors"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                  ></path>
                </svg>
              </a>
            </li>
            @for (breadcrumb of breadcrumbs(); track breadcrumb.url) {
              <li>
                <div class="flex items-center">
                  <svg
                    class="w-4 h-4 text-blue-300 mx-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <a
                    [routerLink]="breadcrumb.url"
                    class="text-blue-200 hover:text-white transition-colors"
                  >
                    {{ breadcrumb.label }}
                  </a>
                </div>
              </li>
            }
          </ol>
        </nav>
      </div>
    }
  `,
  styles: [],
})
export class BreadcrumbsComponent {
  private navigationService = inject(NavigationService);

  breadcrumbs = this.navigationService.breadcrumbs;
}
