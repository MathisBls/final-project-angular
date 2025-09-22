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
  private appointments = signal<Appointment[]>([]);

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
        // Marquer automatiquement les rendez-vous passés comme terminés
        const updatedAppointments =
          this.markPastAppointmentsAsCompleted(appointments);
        this.appointments.set(updatedAppointments);
        // Sauvegarder les changements si nécessaire
        if (
          updatedAppointments.length !== appointments.length ||
          updatedAppointments.some(
            (app, index) => app.status !== appointments[index].status,
          )
        ) {
          this.saveAppointmentsToStorage();
        }
      }
    } catch (error) {
      console.error(
        'Erreur lors du chargement des rendez-vous depuis localStorage:',
        error,
      );
      localStorage.removeItem('doctolib_appointments');
    }
  }

  private markPastAppointmentsAsCompleted(
    appointments: Appointment[],
  ): Appointment[] {
    const now = new Date();
    return appointments.map((appointment) => {
      const appointmentDateTime = new Date(appointment.date);
      const appointmentTime = appointment.time.split(':');
      appointmentDateTime.setHours(
        parseInt(appointmentTime[0]),
        parseInt(appointmentTime[1]),
        0,
        0,
      );

      // Si le rendez-vous est passé et n'est pas déjà terminé ou annulé
      if (
        appointmentDateTime < now &&
        appointment.status !== 'completed' &&
        appointment.status !== 'cancelled'
      ) {
        return {
          ...appointment,
          status: 'completed' as const,
          updatedAt: new Date(),
        };
      }
      return appointment;
    });
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
    const appointments = this.appointments();
    // Marquer les rendez-vous passés comme terminés
    const updatedAppointments =
      this.markPastAppointmentsAsCompleted(appointments);
    if (
      updatedAppointments.some(
        (app, index) => app.status !== appointments[index].status,
      )
    ) {
      this.appointments.set(updatedAppointments);
      this.saveAppointmentsToStorage();
    }
    return updatedAppointments;
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
