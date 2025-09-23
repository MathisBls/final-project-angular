import { Pipe, PipeTransform } from '@angular/core';

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

@Pipe({
  name: 'statusLabel',
  standalone: true,
})
export class StatusLabelPipe implements PipeTransform {
  transform(status: AppointmentStatus | string): string {
    const statusMap: Record<string, string> = {
      scheduled: 'Programmé',
      confirmed: 'Confirmé',
      completed: 'Terminé',
      cancelled: 'Annulé',
      pending: 'En attente',
      active: 'Actif',
      inactive: 'Inactif',
    };

    return statusMap[status] || status;
  }
}
