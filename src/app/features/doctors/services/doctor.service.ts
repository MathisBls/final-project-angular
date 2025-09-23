import { Injectable, signal } from '@angular/core';
import {
  Doctor,
  Speciality,
  DoctorSearchFilters,
  CreateDoctorRequest,
  TimeSlot,
} from '../models/doctor.model';
import { User } from '../../auth/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private doctors = signal<Doctor[]>([
    {
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
      bio: 'Cardiologue expérimenté spécialisé dans les maladies cardiovasculaires et la prévention.',
      education: ['Université de Paris', 'Spécialisation en Cardiologie'],
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
      availableSlots: [
        { start: '09:00', end: '10:00', isAvailable: true },
        { start: '10:00', end: '11:00', isAvailable: true },
        { start: '11:00', end: '12:00', isAvailable: true },
        { start: '14:00', end: '15:00', isAvailable: true },
        { start: '15:00', end: '16:00', isAvailable: true },
        { start: '16:00', end: '17:00', isAvailable: true },
      ],
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    {
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
      bio: 'Dermatologue spécialisée dans les soins de la peau et les traitements esthétiques.',
      education: ['Université de Lyon', 'Spécialisation en Dermatologie'],
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
      availableSlots: [
        { start: '08:00', end: '09:00', isAvailable: true },
        { start: '09:00', end: '10:00', isAvailable: true },
        { start: '10:00', end: '11:00', isAvailable: true },
        { start: '11:00', end: '12:00', isAvailable: true },
        { start: '13:00', end: '14:00', isAvailable: true },
        { start: '14:00', end: '15:00', isAvailable: true },
        { start: '15:00', end: '16:00', isAvailable: true },
      ],
      createdAt: new Date('2024-01-04'),
      updatedAt: new Date('2024-01-04'),
    },
  ]);

  private specialities = signal<Speciality[]>([
    {
      id: 1,
      name: 'Cardiologie',
      description:
        'Spécialité médicale qui traite les maladies du cœur et des vaisseaux sanguins',
      icon: 'heart',
      color: '#ef4444',
    },
    {
      id: 2,
      name: 'Dermatologie',
      description: 'Spécialité médicale qui traite les maladies de la peau',
      icon: 'skin',
      color: '#f59e0b',
    },
    {
      id: 3,
      name: 'Neurologie',
      description:
        'Spécialité médicale qui traite les maladies du système nerveux',
      icon: 'brain',
      color: '#3b82f6',
    },
    {
      id: 4,
      name: 'Pédiatrie',
      description: 'Spécialité médicale qui traite les enfants et adolescents',
      icon: 'child',
      color: '#10b981',
    },
    {
      id: 5,
      name: 'Gynécologie',
      description: 'Spécialité médicale qui traite la santé de la femme',
      icon: 'female',
      color: '#ec4899',
    },
  ]);

  constructor() {
    this.loadDoctorsFromStorage();
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private loadDoctorsFromStorage() {
    try {
      const savedDoctors = localStorage.getItem('doctolib_doctors');
      if (savedDoctors) {
        const doctors = JSON.parse(savedDoctors);
        this.doctors.set(doctors);
      }
    } catch (error) {
      console.error(
        'Erreur lors du chargement des médecins depuis localStorage:',
        error,
      );
      localStorage.removeItem('doctolib_doctors');
    }
  }

  private saveDoctorsToStorage() {
    try {
      localStorage.setItem('doctolib_doctors', JSON.stringify(this.doctors()));
    } catch (error) {
      console.error(
        'Erreur lors de la sauvegarde des médecins dans localStorage:',
        error,
      );
    }
  }

  async getAllDoctors(): Promise<Doctor[]> {
    await this.delay(300);
    return this.doctors();
  }

  async getDoctorById(id: number): Promise<Doctor | undefined> {
    await this.delay(200);
    return this.doctors().find((d) => d.id === id);
  }

  async searchDoctors(filters: DoctorSearchFilters): Promise<Doctor[]> {
    await this.delay(400);

    let filteredDoctors = this.doctors().filter((doctor) => doctor.isAvailable);

    if (filters.speciality) {
      filteredDoctors = filteredDoctors.filter((doctor) =>
        doctor.speciality
          .toLowerCase()
          .includes(filters.speciality!.toLowerCase()),
      );
    }

    if (filters.rating) {
      filteredDoctors = filteredDoctors.filter(
        (doctor) => doctor.rating >= filters.rating!,
      );
    }

    if (filters.priceRange) {
      filteredDoctors = filteredDoctors.filter(
        (doctor) =>
          doctor.consultationFee >= filters.priceRange!.min &&
          doctor.consultationFee <= filters.priceRange!.max,
      );
    }

    return filteredDoctors;
  }

  async getSpecialities(): Promise<Speciality[]> {
    await this.delay(200);
    return this.specialities();
  }

  async createDoctor(
    doctorData: CreateDoctorRequest,
    userData: User,
  ): Promise<Doctor> {
    await this.delay(500);

    const newDoctor: Doctor = {
      id: Date.now(),
      userId: doctorData.userId,
      user: userData,
      speciality: doctorData.speciality,
      licenseNumber: doctorData.licenseNumber,
      experience: doctorData.experience,
      consultationFee: doctorData.consultationFee,
      rating: 0,
      totalReviews: 0,
      bio: doctorData.bio,
      education: doctorData.education,
      languages: doctorData.languages,
      isAvailable: true,
      workingHours: doctorData.workingHours,
      availableSlots: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.doctors.update((doctors) => [...doctors, newDoctor]);
    this.saveDoctorsToStorage();
    return newDoctor;
  }

  async updateDoctor(
    id: number,
    updates: Partial<Doctor>,
  ): Promise<Doctor | undefined> {
    await this.delay(300);

    let updatedDoctor: Doctor | undefined;
    this.doctors.update((doctors) =>
      doctors.map((doctor) => {
        if (doctor.id === id) {
          updatedDoctor = {
            ...doctor,
            ...updates,
            updatedAt: new Date(),
          };
          return updatedDoctor;
        }
        return doctor;
      }),
    );

    if (updates.user) {
      try {
        const savedUsers = localStorage.getItem('doctolib_users');
        if (savedUsers) {
          const users = JSON.parse(savedUsers);
          const userIndex = users.findIndex(
            (u: User) => u.id === updates.user!.id,
          );
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

    this.saveDoctorsToStorage();
    return updatedDoctor;
  }

  async deleteDoctor(id: number): Promise<boolean> {
    await this.delay(250);

    let deleted = false;
    this.doctors.update((doctors) => {
      const initialLength = doctors.length;
      const filtered = doctors.filter((doctor) => doctor.id !== id);
      deleted = filtered.length < initialLength;
      return filtered;
    });

    this.saveDoctorsToStorage();
    return deleted;
  }

  async getAvailableSlots(doctorId: number): Promise<TimeSlot[]> {
    await this.delay(200);

    const doctor = this.doctors().find((d) => d.id === doctorId);
    if (!doctor) {
      return [];
    }

    const availableSlots = doctor.availableSlots.filter(
      (slot) => slot.isAvailable,
    );
    return availableSlots;
  }
}
