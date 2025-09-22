import { User } from '../../auth/models/user.model';
import { Doctor } from '../../doctors/models/doctor.model';
import { Patient } from '../../patients/models/patient.model';
import { Appointment } from '../../appointments/models/appointment.model';

export interface AdminDashboard {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  monthlyRevenue: number;
  topSpecialities: SpecialityStats[];
  recentAppointments: Appointment[];
  systemHealth: SystemHealth;
}

export interface SpecialityStats {
  speciality: string;
  count: number;
  percentage: number;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  responseTime: number;
  errorRate: number;
  lastBackup: Date;
}

export interface UserManagement {
  users: User[];
  doctors: Doctor[];
  patients: Patient[];
  totalPages: number;
  currentPage: number;
  filters: UserFilters;
}

export interface UserFilters {
  role?: 'patient' | 'doctor' | 'admin';
  isActive?: boolean;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalDoctors: number;
  verifiedDoctors: number;
  pendingDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  monthlyRevenue: number;
  averageRating: number;
}
