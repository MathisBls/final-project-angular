import { PricePipe } from './price.pipe';

describe('PricePipe', () => {
  let pipe: PricePipe;

  beforeEach(() => {
    pipe = new PricePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format price with default EUR currency', () => {
    expect(pipe.transform(50)).toBe('50 €');
    expect(pipe.transform(50.5)).toBe('50,50 €');
    expect(pipe.transform(1000)).toBe('1 000 €');
  });

  it('should format price with custom currency', () => {
    expect(pipe.transform(50, 'USD')).toBe('50 $US');
    expect(pipe.transform(50, 'GBP')).toBe('50 £GB');
  });

  it('should handle decimal numbers', () => {
    expect(pipe.transform(99.99)).toBe('99,99 €');
    expect(pipe.transform(99.9)).toBe('99,90 €');
    expect(pipe.transform(99.0)).toBe('99 €');
  });

  it('should handle large numbers', () => {
    expect(pipe.transform(1234567.89)).toBe('1 234 567,89 €');
  });

  it('should handle zero', () => {
    expect(pipe.transform(0)).toBe('0 €');
  });

  it('should handle negative numbers', () => {
    expect(pipe.transform(-50)).toBe('-50 €');
    expect(pipe.transform(-1000.5)).toBe('-1 000,50 €');
  });

  it('should return N/A for null values', () => {
    expect(pipe.transform(null)).toBe('N/A');
  });

  it('should return N/A for undefined values', () => {
    expect(pipe.transform(undefined)).toBe('N/A');
  });

  it('should handle very small decimal values', () => {
    expect(pipe.transform(0.01)).toBe('0,01 €');
    expect(pipe.transform(0.001)).toBe('0 €');
  });

  it('should format with different currencies correctly', () => {
    expect(pipe.transform(100, 'JPY')).toBe('100 ¥');
    expect(pipe.transform(100, 'CHF')).toBe('100 CHF');
  });
});
