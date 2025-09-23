import { RelativeTimePipe } from './relative-time.pipe';

describe('RelativeTimePipe', () => {
  let pipe: RelativeTimePipe;

  beforeEach(() => {
    pipe = new RelativeTimePipe();
    // Mock current date to ensure consistent tests
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2024-03-15T10:00:00.000Z'));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return N/A for null values', () => {
    expect(pipe.transform(null)).toBe('N/A');
  });

  it('should return N/A for undefined values', () => {
    expect(pipe.transform(undefined)).toBe('N/A');
  });

  it('should return "À l\'instant" for very recent dates', () => {
    const recent = new Date('2024-03-15T09:59:59.000Z');
    expect(pipe.transform(recent)).toBe("À l'instant");
  });

  it('should handle minutes correctly', () => {
    const oneMinuteAgo = new Date('2024-03-15T09:59:00.000Z');
    const fiveMinutesAgo = new Date('2024-03-15T09:55:00.000Z');

    expect(pipe.transform(oneMinuteAgo)).toBe('Il y a 1 minute');
    expect(pipe.transform(fiveMinutesAgo)).toBe('Il y a 5 minutes');
  });

  it('should handle hours correctly', () => {
    const oneHourAgo = new Date('2024-03-15T09:00:00.000Z');
    const threeHoursAgo = new Date('2024-03-15T07:00:00.000Z');

    expect(pipe.transform(oneHourAgo)).toBe('Il y a 1 heure');
    expect(pipe.transform(threeHoursAgo)).toBe('Il y a 3 heures');
  });

  it('should handle days correctly', () => {
    const oneDayAgo = new Date('2024-03-14T10:00:00.000Z');
    const threeDaysAgo = new Date('2024-03-12T10:00:00.000Z');

    expect(pipe.transform(oneDayAgo)).toBe('Il y a 1 jour');
    expect(pipe.transform(threeDaysAgo)).toBe('Il y a 3 jours');
  });

  it('should return formatted date for dates older than a week', () => {
    const oneWeekAgo = new Date('2024-03-08T10:00:00.000Z');
    const oneMonthAgo = new Date('2024-02-15T10:00:00.000Z');

    // Should return formatted date for dates older than 7 days
    expect(pipe.transform(oneWeekAgo)).toBe('8 mars 2024');
    expect(pipe.transform(oneMonthAgo)).toBe('15 févr. 2024');
  });

  it('should handle string dates', () => {
    const dateString = '2024-03-15T09:55:00.000Z';
    expect(pipe.transform(dateString)).toBe('Il y a 5 minutes');
  });

  it('should handle edge case at exactly 1 minute', () => {
    const exactlyOneMinute = new Date('2024-03-15T09:59:00.000Z');
    expect(pipe.transform(exactlyOneMinute)).toBe('Il y a 1 minute');
  });

  it('should handle edge case at exactly 1 hour', () => {
    const exactlyOneHour = new Date('2024-03-15T09:00:00.000Z');
    expect(pipe.transform(exactlyOneHour)).toBe('Il y a 1 heure');
  });

  it('should handle edge case at exactly 1 day', () => {
    const exactlyOneDay = new Date('2024-03-14T10:00:00.000Z');
    expect(pipe.transform(exactlyOneDay)).toBe('Il y a 1 jour');
  });

  it('should handle future dates (negative time difference)', () => {
    const futureDate = new Date('2024-03-15T11:00:00.000Z');
    // Future dates should still work, showing negative values
    const result = pipe.transform(futureDate);
    expect(result).toBeDefined();
  });
});
