import { Injectable, signal, inject } from '@angular/core';
import {
  Patient,
  MedicalRecord,
  CreatePatientRequest,
} from '../models/patient.model';
import { AppointmentService } from '../../appointments/services/appointment.service';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);

  private patients = signal<Patient[]>([]);

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAllPatients(): Promise<Patient[]> {
    await this.delay(300);

    try {
      const appointments = await this.appointmentService.getAllAppointments();
      const allUsers = await this.authService.getAllUsers();

      // Récupérer tous les patients uniques depuis les rendez-vous
      const patientMap = new Map<number, Patient>();

      appointments.forEach((appointment) => {
        if (!patientMap.has(appointment.patientId)) {
          patientMap.set(appointment.patientId, appointment.patient);
        }
      });

      // Ajouter aussi les utilisateurs avec le rôle 'patient' qui n'ont pas encore de rendez-vous
      const patientUsers = allUsers.filter((user) => user.role === 'patient');

      patientUsers.forEach((user) => {
        if (!patientMap.has(user.id)) {
          // Créer un profil patient basique pour les utilisateurs sans rendez-vous
          const basicPatient: Patient = {
            id: user.id,
            userId: user.id,
            user: user,
            dateOfBirth: new Date('1990-01-01'), // Date par défaut
            gender: 'other',
            address: {
              street: 'Non renseigné',
              city: 'Non renseigné',
              postalCode: '00000',
              country: 'France',
            },
            emergencyContact: {
              name: 'Non renseigné',
              phone: 'Non renseigné',
              relationship: 'Non renseigné',
            },
            medicalHistory: [],
            allergies: [],
            currentMedications: [],
            insuranceNumber: 'Non renseigné',
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
          patientMap.set(user.id, basicPatient);
        }
      });

      const patients = Array.from(patientMap.values());
      this.patients.set(patients);
      return patients;
    } catch (error) {
      console.error('Erreur lors du chargement des patients:', error);
      return [];
    }
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

    // Mettre à jour aussi dans localStorage si c'est une mise à jour de l'utilisateur
    if (updates.user) {
      try {
        const savedUsers = localStorage.getItem('doctolib_users');
        if (savedUsers) {
          const users = JSON.parse(savedUsers);
          const userIndex = users.findIndex((u: User) => u.id === id);
          if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates.user };
            localStorage.setItem('doctolib_users', JSON.stringify(users));
          }
        }
      } catch (error) {
        console.error(
          'Erreur lors de la mise à jour dans localStorage:',
          error,
        );
      }
    }

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
