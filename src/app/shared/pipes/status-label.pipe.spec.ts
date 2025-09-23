import { StatusLabelPipe } from './status-label.pipe';

describe('StatusLabelPipe', () => {
  let pipe: StatusLabelPipe;

  beforeEach(() => {
    pipe = new StatusLabelPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform appointment statuses correctly', () => {
    expect(pipe.transform('scheduled')).toBe('Programmé');
    expect(pipe.transform('confirmed')).toBe('Confirmé');
    expect(pipe.transform('completed')).toBe('Terminé');
    expect(pipe.transform('cancelled')).toBe('Annulé');
  });

  it('should transform general statuses correctly', () => {
    expect(pipe.transform('pending')).toBe('En attente');
    expect(pipe.transform('active')).toBe('Actif');
    expect(pipe.transform('inactive')).toBe('Inactif');
  });

  it('should return original status for unknown statuses', () => {
    expect(pipe.transform('unknown')).toBe('unknown');
    expect(pipe.transform('custom-status')).toBe('custom-status');
    expect(pipe.transform('')).toBe('');
  });

  it('should handle case sensitivity', () => {
    expect(pipe.transform('SCHEDULED')).toBe('SCHEDULED'); // Case sensitive
    expect(pipe.transform('Completed')).toBe('Completed'); // Case sensitive
  });

  it('should handle all defined appointment statuses', () => {
    const appointmentStatuses = [
      { input: 'scheduled', expected: 'Programmé' },
      { input: 'confirmed', expected: 'Confirmé' },
      { input: 'completed', expected: 'Terminé' },
      { input: 'cancelled', expected: 'Annulé' },
    ];

    appointmentStatuses.forEach(({ input, expected }) => {
      expect(pipe.transform(input)).toBe(expected);
    });
  });

  it('should handle all defined general statuses', () => {
    const generalStatuses = [
      { input: 'pending', expected: 'En attente' },
      { input: 'active', expected: 'Actif' },
      { input: 'inactive', expected: 'Inactif' },
    ];

    generalStatuses.forEach(({ input, expected }) => {
      expect(pipe.transform(input)).toBe(expected);
    });
  });

  it('should work with type-safe appointment status enum', () => {
    // Testing with the exact type from the pipe
    const status = 'scheduled' as const;
    expect(pipe.transform(status)).toBe('Programmé');
  });

  it('should handle numeric inputs as strings', () => {
    expect(pipe.transform('1')).toBe('1');
    expect(pipe.transform('0')).toBe('0');
  });
});
