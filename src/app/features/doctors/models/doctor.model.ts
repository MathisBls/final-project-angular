import { User } from '../../auth/models/user.model';

export interface Doctor {
  id: number;
  userId: number;
  user: User;
  speciality: string;
  licenseNumber: string;
  experience: number; // en années
  consultationFee: number;
  rating: number;
  totalReviews: number;
  bio: string;
  education: string[];
  languages: string[];
  isAvailable: boolean;
  workingHours: WorkingHours;
  availableSlots: TimeSlot[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkingHours {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  start: string; // Format: "09:00"
  end: string; // Format: "10:00"
  isAvailable: boolean;
}

export interface Speciality {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface DoctorSearchFilters {
  speciality?: string;
  location?: string;
  rating?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  availability?: string; // Date au format YYYY-MM-DD
}

export interface CreateDoctorRequest {
  userId: number;
  speciality: string;
  licenseNumber: string;
  experience: number;
  consultationFee: number;
  bio: string;
  education: string[];
  languages: string[];
  workingHours: WorkingHours;
}
