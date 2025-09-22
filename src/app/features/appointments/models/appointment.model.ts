import { Doctor } from '../../doctors/models/doctor.model';
import { Patient } from '../../patients/models/patient.model';

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  patient: Patient;
  doctor: Doctor;
  date: Date;
  time: string; // Format: "09:00"
  duration: number; // en minutes
  status:
    | 'scheduled'
    | 'confirmed'
    | 'in-progress'
    | 'completed'
    | 'cancelled'
    | 'no-show';
  reason: string;
  symptoms?: string;
  notes?: string;
  prescription?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAppointmentRequest {
  patientId: number;
  doctorId: number;
  date: Date;
  time: string;
  duration: number;
  reason: string;
  symptoms?: string;
}

export interface UpdateAppointmentRequest {
  status?: Appointment['status'];
  notes?: string;
  prescription?: string;
  followUpRequired?: boolean;
  followUpDate?: Date;
}

export interface AppointmentSlot {
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:MM
  duration: number;
  isAvailable: boolean;
  doctorId: number;
}

export interface AppointmentFilters {
  patientId?: number;
  doctorId?: number;
  status?: Appointment['status'];
  dateFrom?: Date;
  dateTo?: Date;
  speciality?: string;
}
