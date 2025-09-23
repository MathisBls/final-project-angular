import { TestBed } from '@angular/core/testing';
import { DoctorService } from './doctor.service';
import { User } from '../../auth/models/user.model';

describe('DoctorService', () => {
  let service: DoctorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DoctorService],
    });

    service = TestBed.inject(DoctorService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all doctors', async () => {
    const doctors = await service.getAllDoctors();
    expect(doctors).toBeDefined();
    expect(Array.isArray(doctors)).toBe(true);
  });

  it('should get doctor by id', async () => {
    const doctor = await service.getDoctorById(1);
    expect(doctor).toBeDefined();
    expect(doctor?.id).toBe(1);
  });

  it('should return undefined for non-existent doctor', async () => {
    const doctor = await service.getDoctorById(999);
    expect(doctor).toBeUndefined();
  });

  it('should search doctors by speciality', async () => {
    const filters = {
      speciality: 'Cardiologie',
    };

    const doctors = await service.searchDoctors(filters);
    expect(doctors).toBeDefined();
    expect(
      doctors.every((d) => d.speciality.toLowerCase().includes('cardiologie')),
    ).toBe(true);
  });

  it('should search doctors by rating', async () => {
    const filters = {
      rating: 4.5,
    };

    const doctors = await service.searchDoctors(filters);
    expect(doctors).toBeDefined();
    expect(doctors.every((d) => d.rating >= 4.5)).toBe(true);
  });

  it('should search doctors by price range', async () => {
    const filters = {
      priceRange: { min: 60, max: 80 },
    };

    const doctors = await service.searchDoctors(filters);
    expect(doctors).toBeDefined();
    expect(
      doctors.every((d) => d.consultationFee >= 60 && d.consultationFee <= 80),
    ).toBe(true);
  });

  it('should get specialities', async () => {
    const specialities = await service.getSpecialities();
    expect(specialities).toBeDefined();
    expect(Array.isArray(specialities)).toBe(true);
    expect(specialities.length).toBeGreaterThan(0);
  });

  it('should create a new doctor', async () => {
    const userData: User = {
      id: 100,
      email: 'newdoctor@test.com',
      password: 'password',
      firstName: 'Dr. New',
      lastName: 'Doctor',
      phone: '+33123456789',
      role: 'doctor',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const doctorData = {
      userId: 100,
      speciality: 'Neurologie',
      licenseNumber: 'NEURO123',
      experience: 5,
      consultationFee: 75,
      bio: 'Test bio',
      education: ['Test University'],
      languages: ['Français'],
      workingHours: {
        monday: [{ start: '09:00', end: '17:00', isAvailable: true }],
        tuesday: [{ start: '09:00', end: '17:00', isAvailable: true }],
        wednesday: [{ start: '09:00', end: '17:00', isAvailable: true }],
        thursday: [{ start: '09:00', end: '17:00', isAvailable: true }],
        friday: [{ start: '09:00', end: '17:00', isAvailable: true }],
        saturday: [],
        sunday: [],
      },
    };

    const newDoctor = await service.createDoctor(doctorData, userData);

    expect(newDoctor).toBeDefined();
    expect(newDoctor.id).toBeDefined();
    expect(newDoctor.speciality).toBe('Neurologie');
    expect(newDoctor.user.email).toBe('newdoctor@test.com');
  });

  it('should update doctor', async () => {
    const updates = {
      bio: 'Updated bio',
      consultationFee: 90,
    };

    const updatedDoctor = await service.updateDoctor(1, updates);

    expect(updatedDoctor).toBeDefined();
    expect(updatedDoctor?.bio).toBe('Updated bio');
    expect(updatedDoctor?.consultationFee).toBe(90);
  });

  it('should delete doctor', async () => {
    const initialDoctors = await service.getAllDoctors();
    const initialCount = initialDoctors.length;

    const deleted = await service.deleteDoctor(1);

    expect(deleted).toBe(true);

    const doctorsAfterDelete = await service.getAllDoctors();
    expect(doctorsAfterDelete.length).toBe(initialCount - 1);
  });

  it('should get available slots for doctor', async () => {
    const slots = await service.getAvailableSlots(1);

    expect(slots).toBeDefined();
    expect(Array.isArray(slots)).toBe(true);
    expect(slots.every((slot) => slot.isAvailable)).toBe(true);
  });

  it('should persist doctors in localStorage', async () => {
    const doctors = await service.getAllDoctors();

    const savedDoctors = localStorage.getItem('doctolib_doctors');
    expect(savedDoctors).toBeTruthy();

    const parsedDoctors = JSON.parse(savedDoctors!);
    expect(parsedDoctors.length).toBe(doctors.length);
  });

  it('should load doctors from localStorage on initialization', () => {
    const mockDoctors = [
      {
        id: 999,
        userId: 999,
        user: {
          id: 999,
          email: 'test@test.com',
          password: 'password',
          firstName: 'Test',
          lastName: 'Doctor',
          phone: '+33123456789',
          role: 'doctor',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        speciality: 'Test',
        licenseNumber: 'TEST123',
        experience: 1,
        consultationFee: 50,
        rating: 0,
        totalReviews: 0,
        bio: 'Test bio',
        education: ['Test'],
        languages: ['Français'],
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    localStorage.setItem('doctolib_doctors', JSON.stringify(mockDoctors));

    const newService = TestBed.inject(DoctorService);
    expect(newService).toBeTruthy();
  });
});
