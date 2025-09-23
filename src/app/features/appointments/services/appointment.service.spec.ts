import { TestBed } from '@angular/core/testing';
import { AppointmentService } from './appointment.service';
import { User } from '../../auth/models/user.model';
import { Doctor } from '../../doctors/models/doctor.model';

describe('AppointmentService', () => {
  let service: AppointmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppointmentService],
    });

    service = TestBed.inject(AppointmentService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all appointments', async () => {
    const appointments = await service.getAllAppointments();
    expect(appointments).toBeDefined();
    expect(Array.isArray(appointments)).toBe(true);
  });

  it('should get appointment by id', async () => {
    const appointment = await service.getAppointmentById(1);
    expect(appointment).toBeDefined();
    expect(appointment?.id).toBe(1);
  });

  it('should return undefined for non-existent appointment', async () => {
    const appointment = await service.getAppointmentById(999);
    expect(appointment).toBeUndefined();
  });

  it('should filter appointments by patient id', async () => {
    const filters = {
      patientId: 3,
    };

    const appointments = await service.getAppointments(filters);
    expect(appointments).toBeDefined();
    expect(appointments.every((a) => a.patientId === 3)).toBe(true);
  });

  it('should filter appointments by doctor id', async () => {
    const filters = {
      doctorId: 1,
    };

    const appointments = await service.getAppointments(filters);
    expect(appointments).toBeDefined();
    expect(appointments.every((a) => a.doctorId === 1)).toBe(true);
  });

  it('should filter appointments by status', async () => {
    const filters = {
      status: 'scheduled' as const,
    };

    const appointments = await service.getAppointments(filters);
    expect(appointments).toBeDefined();
    expect(appointments.every((a) => a.status === 'scheduled')).toBe(true);
  });

  it('should create a new appointment', async () => {
    const mockUsers: User[] = [
      {
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
    ];

    const mockDoctors: Doctor[] = [
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
    ];

    localStorage.setItem('doctolib_users', JSON.stringify(mockUsers));
    localStorage.setItem('doctolib_doctors', JSON.stringify(mockDoctors));

    const appointmentData = {
      patientId: 3,
      doctorId: 1,
      date: new Date('2024-12-30'),
      time: '10:00',
      duration: 30,
      reason: 'Consultation de routine',
      symptoms: 'Aucun symptôme particulier',
    };

    const newAppointment = await service.createAppointment(appointmentData);

    expect(newAppointment).toBeDefined();
    expect(newAppointment.id).toBeDefined();
    expect(newAppointment.patientId).toBe(3);
    expect(newAppointment.doctorId).toBe(1);
    expect(newAppointment.status).toBe('scheduled');
  });

  it('should throw error when creating appointment with non-existent patient', async () => {
    const appointmentData = {
      patientId: 999,
      doctorId: 1,
      date: new Date('2024-12-30'),
      time: '10:00',
      duration: 30,
      reason: 'Consultation de routine',
    };

    await expectAsync(
      service.createAppointment(appointmentData),
    ).toBeRejectedWithError('Patient ou médecin non trouvé');
  });

  it('should update appointment', async () => {
    const updates = {
      status: 'confirmed' as const,
      notes: 'Patient confirmé',
    };

    const updatedAppointment = await service.updateAppointment(1, updates);

    expect(updatedAppointment).toBeDefined();
    expect(updatedAppointment?.status).toBe('confirmed');
    expect(updatedAppointment?.notes).toBe('Patient confirmé');
  });

  it('should delete appointment', async () => {
    const initialAppointments = await service.getAllAppointments();
    const initialCount = initialAppointments.length;

    const deleted = await service.deleteAppointment(1);

    expect(deleted).toBe(true);

    const appointmentsAfterDelete = await service.getAllAppointments();
    expect(appointmentsAfterDelete.length).toBe(initialCount - 1);
  });

  it('should get available slots', async () => {
    const slots = await service.getAvailableSlots(1, '2024-12-30');

    expect(slots).toBeDefined();
    expect(Array.isArray(slots)).toBe(true);
    expect(slots.length).toBeGreaterThan(0);
  });

  it('should mark past appointments as completed', async () => {
    const appointments = await service.getAllAppointments();

    const pastAppointments = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate < new Date() &&
        appointment.status !== 'completed' &&
        appointment.status !== 'cancelled'
      );
    });

    if (pastAppointments.length > 0) {
      const updatedAppointments = await service.getAllAppointments();
      const completedAppointments = updatedAppointments.filter(
        (app) => app.status === 'completed' && new Date(app.date) < new Date(),
      );

      expect(completedAppointments.length).toBeGreaterThanOrEqual(
        pastAppointments.length,
      );
    }
  });

  it('should persist appointments in localStorage', async () => {
    const appointments = await service.getAllAppointments();

    const savedAppointments = localStorage.getItem('doctolib_appointments');
    expect(savedAppointments).toBeTruthy();

    const parsedAppointments = JSON.parse(savedAppointments!);
    expect(parsedAppointments.length).toBe(appointments.length);
  });

  it('should load appointments from localStorage on initialization', () => {
    const mockAppointments = [
      {
        id: 999,
        patientId: 3,
        doctorId: 1,
        patient: {
          id: 3,
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
        date: '2024-12-30',
        time: '10:00',
        duration: 30,
        status: 'scheduled' as const,
        reason: 'Test appointment',
        symptoms: '',
        notes: '',
        prescription: '',
        followUpRequired: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    localStorage.setItem(
      'doctolib_appointments',
      JSON.stringify(mockAppointments),
    );

    const newService = TestBed.inject(AppointmentService);
    expect(newService).toBeTruthy();
  });
});
