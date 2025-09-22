import { Injectable, signal } from '@angular/core';
import {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  AppointmentSlot,
  AppointmentFilters,
} from '../models/appointment.model';
import { User } from '../../auth/models/user.model';
import { Doctor } from '../../doctors/models/doctor.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private appointments = signal<Appointment[]>([
    {
      id: 1,
      patientId: 1,
      doctorId: 1,
      patient: {
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
        medicalHistory: [],
        allergies: ['Pénicilline'],
        currentMedications: [],
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
      doctor: {
        id: 1,
        userId: 2,
        user: {
          id: 2,
          email: 'dr.martin@doctolib.com',
          password: 'doctor123',
          firstName: 'Dr. Jean',
          lastName: 'Martin',
          phone: '+33123456790',
          role: 'doctor',
          isActive: true,
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02'),
        },
        speciality: 'Cardiologie',
        licenseNumber: 'CARD123456',
        experience: 15,
        consultationFee: 80,
        rating: 4.8,
        totalReviews: 127,
        bio: 'Cardiologue expérimenté',
        education: ['Université de Paris'],
        languages: ['Français', 'Anglais'],
        isAvailable: true,
        workingHours: {
          monday: [{ start: '09:00', end: '17:00', isAvailable: true }],
          tuesday: [{ start: '09:00', end: '17:00', isAvailable: true }],
          wednesday: [{ start: '09:00', end: '17:00', isAvailable: true }],
          thursday: [{ start: '09:00', end: '17:00', isAvailable: true }],
          friday: [{ start: '09:00', end: '17:00', isAvailable: true }],
          saturday: [],
          sunday: [],
        },
        availableSlots: [],
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      date: new Date('2024-01-20'),
      time: '10:00',
      duration: 30,
      status: 'scheduled',
      reason: 'Consultation de routine',
      symptoms: 'Douleurs thoraciques légères',
      notes: 'Patient à surveiller',
      prescription: '',
      followUpRequired: true,
      followUpDate: new Date('2024-02-20'),
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: 2,
      patientId: 1,
      doctorId: 2,
      patient: {
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
        medicalHistory: [],
        allergies: ['Pénicilline'],
        currentMedications: [],
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
      doctor: {
        id: 2,
        userId: 4,
        user: {
          id: 4,
          email: 'dr.bernard@doctolib.com',
          password: 'doctor123',
          firstName: 'Dr. Sophie',
          lastName: 'Bernard',
          phone: '+33123456792',
          role: 'doctor',
          isActive: true,
          createdAt: new Date('2024-01-04'),
          updatedAt: new Date('2024-01-04'),
        },
        speciality: 'Dermatologie',
        licenseNumber: 'DERM789012',
        experience: 8,
        consultationFee: 70,
        rating: 4.6,
        totalReviews: 89,
        bio: 'Dermatologue spécialisée',
        education: ['Université de Lyon'],
        languages: ['Français', 'Espagnol'],
        isAvailable: true,
        workingHours: {
          monday: [{ start: '08:00', end: '16:00', isAvailable: true }],
          tuesday: [{ start: '08:00', end: '16:00', isAvailable: true }],
          wednesday: [{ start: '08:00', end: '16:00', isAvailable: true }],
          thursday: [{ start: '08:00', end: '16:00', isAvailable: true }],
          friday: [{ start: '08:00', end: '16:00', isAvailable: true }],
          saturday: [{ start: '09:00', end: '13:00', isAvailable: true }],
          sunday: [],
        },
        availableSlots: [],
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      },
      date: new Date('2024-01-25'),
      time: '14:00',
      duration: 45,
      status: 'confirmed',
      reason: 'Examen de la peau',
      symptoms: 'Éruption cutanée sur le bras',
      notes: '',
      prescription: '',
      followUpRequired: false,
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18'),
    },
  ]);

  constructor() {
    this.loadAppointmentsFromStorage();
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private loadAppointmentsFromStorage() {
    try {
      const savedAppointments = localStorage.getItem('doctolib_appointments');
      if (savedAppointments) {
        const appointments = JSON.parse(savedAppointments);
        this.appointments.set(appointments);
      }
    } catch (error) {
      console.error(
        'Erreur lors du chargement des rendez-vous depuis localStorage:',
        error,
      );
      localStorage.removeItem('doctolib_appointments');
    }
  }

  private saveAppointmentsToStorage() {
    try {
      localStorage.setItem(
        'doctolib_appointments',
        JSON.stringify(this.appointments()),
      );
    } catch (error) {
      console.error(
        'Erreur lors de la sauvegarde des rendez-vous dans localStorage:',
        error,
      );
    }
  }

  async getAllAppointments(): Promise<Appointment[]> {
    await this.delay(300);
    return this.appointments();
  }

  async getAppointmentById(id: number): Promise<Appointment | undefined> {
    await this.delay(200);
    return this.appointments().find((a) => a.id === id);
  }

  async getAppointments(filters: AppointmentFilters): Promise<Appointment[]> {
    await this.delay(300);

    let filteredAppointments = this.appointments();

    if (filters.patientId) {
      filteredAppointments = filteredAppointments.filter(
        (a) => a.patientId === filters.patientId,
      );
    }

    if (filters.doctorId) {
      filteredAppointments = filteredAppointments.filter(
        (a) => a.doctorId === filters.doctorId,
      );
    }

    if (filters.status) {
      filteredAppointments = filteredAppointments.filter(
        (a) => a.status === filters.status,
      );
    }

    if (filters.dateFrom) {
      filteredAppointments = filteredAppointments.filter(
        (a) => a.date >= filters.dateFrom!,
      );
    }

    if (filters.dateTo) {
      filteredAppointments = filteredAppointments.filter(
        (a) => a.date <= filters.dateTo!,
      );
    }

    return filteredAppointments;
  }

  async createAppointment(
    appointmentData: CreateAppointmentRequest,
  ): Promise<Appointment> {
    await this.delay(500);

    // Récupérer les données réelles du patient et du médecin depuis localStorage
    const savedUsers = localStorage.getItem('doctolib_users');
    const savedDoctors = localStorage.getItem('doctolib_doctors');

    if (!savedUsers || !savedDoctors) {
      throw new Error('Données utilisateurs ou médecins non trouvées');
    }

    const users = JSON.parse(savedUsers);
    const doctors = JSON.parse(savedDoctors);

    const patientUser = users.find(
      (u: User) => u.id === appointmentData.patientId,
    );
    const doctorData = doctors.find(
      (d: Doctor) => d.id === appointmentData.doctorId,
    );

    if (!patientUser || !doctorData) {
      throw new Error('Patient ou médecin non trouvé');
    }

    // Créer l'objet patient avec les données réelles
    const patient = {
      id: appointmentData.patientId,
      userId: patientUser.id,
      user: patientUser,
      dateOfBirth: new Date('1985-06-15'), // Valeur par défaut
      gender: 'female' as const,
      address: {
        street: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
      },
      emergencyContact: {
        name: "Contact d'urgence",
        phone: '+33123456789',
        relationship: 'Famille',
      },
      medicalHistory: [],
      allergies: [],
      currentMedications: [],
      createdAt: patientUser.createdAt,
      updatedAt: patientUser.updatedAt,
    };

    const newAppointment: Appointment = {
      id: Date.now(),
      patientId: appointmentData.patientId,
      doctorId: appointmentData.doctorId,
      patient,
      doctor: doctorData,
      date: appointmentData.date,
      time: appointmentData.time,
      duration: appointmentData.duration,
      status: 'scheduled',
      reason: appointmentData.reason,
      symptoms: appointmentData.symptoms,
      notes: '',
      prescription: '',
      followUpRequired: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.appointments.update((appointments) => [
      ...appointments,
      newAppointment,
    ]);
    this.saveAppointmentsToStorage();
    return newAppointment;
  }

  async updateAppointment(
    id: number,
    updates: UpdateAppointmentRequest,
  ): Promise<Appointment | undefined> {
    await this.delay(300);

    let updatedAppointment: Appointment | undefined;
    this.appointments.update((appointments) =>
      appointments.map((appointment) => {
        if (appointment.id === id) {
          updatedAppointment = {
            ...appointment,
            ...updates,
            updatedAt: new Date(),
          };
          return updatedAppointment;
        }
        return appointment;
      }),
    );

    this.saveAppointmentsToStorage();
    return updatedAppointment;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    await this.delay(250);

    let deleted = false;
    this.appointments.update((appointments) => {
      const initialLength = appointments.length;
      const filtered = appointments.filter(
        (appointment) => appointment.id !== id,
      );
      deleted = filtered.length < initialLength;
      return filtered;
    });

    this.saveAppointmentsToStorage();
    return deleted;
  }

  async getAvailableSlots(
    doctorId: number,
    date: string,
  ): Promise<AppointmentSlot[]> {
    await this.delay(200);

    const slots: AppointmentSlot[] = [
      { date, time: '09:00', duration: 30, isAvailable: true, doctorId },
      { date, time: '09:30', duration: 30, isAvailable: true, doctorId },
      { date, time: '10:00', duration: 30, isAvailable: false, doctorId },
      { date, time: '10:30', duration: 30, isAvailable: true, doctorId },
      { date, time: '11:00', duration: 30, isAvailable: true, doctorId },
      { date, time: '14:00', duration: 30, isAvailable: true, doctorId },
      { date, time: '14:30', duration: 30, isAvailable: true, doctorId },
      { date, time: '15:00', duration: 30, isAvailable: false, doctorId },
      { date, time: '15:30', duration: 30, isAvailable: true, doctorId },
      { date, time: '16:00', duration: 30, isAvailable: true, doctorId },
    ];

    return slots;
  }
}
