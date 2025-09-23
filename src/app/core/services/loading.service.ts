import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private activeRequests = signal(0);

  public isLoading = signal(false);

  show(): void {
    this.activeRequests.update((count) => {
      const newCount = count + 1;
      this.isLoading.set(newCount > 0);
      return newCount;
    });
  }

  hide(): void {
    this.activeRequests.update((count) => {
      const newCount = Math.max(0, count - 1);
      this.isLoading.set(newCount > 0);
      return newCount;
    });
  }

  forceHide(): void {
    this.activeRequests.set(0);
    this.isLoading.set(false);
  }

  getActiveRequestsCount(): number {
    return this.activeRequests();
  }
}
