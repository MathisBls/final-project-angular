import { Injectable, signal } from '@angular/core';
import {
  Patient,
  MedicalRecord,
  CreatePatientRequest,
} from '../models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private patients = signal<Patient[]>([
    {
      id: 1,
      userId: 3,
      user: {
        id: 3,
        email: 'patient@doctolib.com',
        password: 'patient123',
        firstName: 'Marie',
        lastName: 'Dubois',
        phone: '+33123456791',
        role: 'patient',
        isActive: true,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
      dateOfBirth: new Date('1985-06-15'),
      gender: 'female',
      address: {
        street: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
      },
      emergencyContact: {
        name: 'Pierre Dubois',
        phone: '+33123456792',
        relationship: 'Époux',
      },
      medicalHistory: [
        {
          id: 1,
          patientId: 1,
          doctorId: 1,
          doctorName: 'Dr. Jean Martin',
          date: new Date('2024-01-10'),
          diagnosis: 'Hypertension artérielle',
          treatment: 'Traitement antihypertenseur',
          notes: 'Surveillance mensuelle recommandée',
        },
      ],
      allergies: ['Pénicilline', 'Pollen'],
      currentMedications: ['Amlodipine 5mg'],
      insuranceNumber: '1234567890123',
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    },
  ]);

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAllPatients(): Promise<Patient[]> {
    await this.delay(300);
    return this.patients();
  }

  async getPatientById(id: number): Promise<Patient | undefined> {
    await this.delay(200);
    return this.patients().find((p) => p.id === id);
  }

  async getPatientByUserId(userId: number): Promise<Patient | undefined> {
    await this.delay(200);
    return this.patients().find((p) => p.userId === userId);
  }

  async createPatient(patientData: CreatePatientRequest): Promise<Patient> {
    await this.delay(500);

    const newPatient: Patient = {
      id: Date.now(),
      userId: patientData.userId,
      user: {
        id: patientData.userId,
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'patient',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      dateOfBirth: patientData.dateOfBirth,
      gender: patientData.gender,
      address: patientData.address,
      emergencyContact: patientData.emergencyContact,
      medicalHistory: [],
      allergies: patientData.allergies || [],
      currentMedications: patientData.currentMedications || [],
      insuranceNumber: patientData.insuranceNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.patients.update((patients) => [...patients, newPatient]);
    return newPatient;
  }

  async updatePatient(
    id: number,
    updates: Partial<Patient>,
  ): Promise<Patient | undefined> {
    await this.delay(300);

    let updatedPatient: Patient | undefined;
    this.patients.update((patients) =>
      patients.map((patient) => {
        if (patient.id === id) {
          updatedPatient = {
            ...patient,
            ...updates,
            updatedAt: new Date(),
          };
          return updatedPatient;
        }
        return patient;
      }),
    );

    return updatedPatient;
  }

  async deletePatient(id: number): Promise<boolean> {
    await this.delay(250);

    let deleted = false;
    this.patients.update((patients) => {
      const initialLength = patients.length;
      const filtered = patients.filter((patient) => patient.id !== id);
      deleted = filtered.length < initialLength;
      return filtered;
    });

    return deleted;
  }

  async addMedicalRecord(
    patientId: number,
    record: Omit<MedicalRecord, 'id' | 'patientId'>,
  ): Promise<MedicalRecord> {
    await this.delay(300);

    const newRecord: MedicalRecord = {
      id: Date.now(),
      patientId,
      ...record,
    };

    this.patients.update((patients) =>
      patients.map((patient) => {
        if (patient.id === patientId) {
          return {
            ...patient,
            medicalHistory: [...patient.medicalHistory, newRecord],
            updatedAt: new Date(),
          };
        }
        return patient;
      }),
    );

    return newRecord;
  }

  async getMedicalHistory(patientId: number): Promise<MedicalRecord[]> {
    await this.delay(200);

    const patient = this.patients().find((p) => p.id === patientId);
    return patient?.medicalHistory || [];
  }
}
