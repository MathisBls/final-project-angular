import { User } from '../../auth/models/user.model';

export interface Patient {
  id: number;
  userId: number;
  user: User;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: MedicalRecord[];
  allergies: string[];
  currentMedications: string[];
  insuranceNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalRecord {
  id: number;
  patientId: number;
  doctorId: number;
  doctorName: string;
  date: Date;
  diagnosis: string;
  treatment: string;
  notes?: string;
  attachments?: string[]; // URLs des documents
}

export interface CreatePatientRequest {
  userId: number;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  allergies?: string[];
  currentMedications?: string[];
  insuranceNumber?: string;
}
