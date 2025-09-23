import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PhoneFormatDirective } from './phone-format.directive';

@Component({
  template: `<input appPhoneFormat data-testid="phone-input" />`,
  standalone: true,
  imports: [PhoneFormatDirective],
})
class TestComponent {}

describe('PhoneFormatDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: HTMLInputElement;
  let inputDebugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    inputDebugElement = fixture.debugElement.query(
      By.css('[data-testid="phone-input"]'),
    );
    inputElement = inputDebugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format French phone number correctly', () => {
    inputElement.value = '0123456789';
    inputDebugElement.triggerEventHandler('input', { target: inputElement });

    expect(inputElement.value).toBe('+33 01 23 45 67 89');
  });

  it('should handle input with existing country code', () => {
    inputElement.value = '33123456789';
    inputDebugElement.triggerEventHandler('input', { target: inputElement });

    expect(inputElement.value).toBe('+33 01 23 45 67 89');
  });

  it('should remove non-numeric characters', () => {
    inputElement.value = '01-23-45-67-89';
    inputDebugElement.triggerEventHandler('input', { target: inputElement });

    expect(inputElement.value).toBe('+33 01 23 45 67 89');
  });

  it('should handle partial phone numbers', () => {
    inputElement.value = '0123';
    inputDebugElement.triggerEventHandler('input', { target: inputElement });

    expect(inputElement.value).toBe('+33 01 23   ');
  });

  it('should add error class on blur for invalid length', () => {
    inputElement.value = '01234';
    inputDebugElement.triggerEventHandler('blur', { target: inputElement });

    expect(inputElement.classList.contains('border-red-500')).toBe(true);
  });

  it('should remove error class on blur for valid length', () => {
    inputElement.classList.add('border-red-500');
    inputElement.value = '0123456789';
    inputDebugElement.triggerEventHandler('blur', { target: inputElement });

    expect(inputElement.classList.contains('border-red-500')).toBe(false);
  });

  it('should handle empty input', () => {
    inputElement.value = '';
    inputDebugElement.triggerEventHandler('input', { target: inputElement });

    expect(inputElement.value).toBe('');
  });

  it('should handle international number starting with 33', () => {
    inputElement.value = '33987654321';
    inputDebugElement.triggerEventHandler('input', { target: inputElement });

    expect(inputElement.value).toBe('+33 98 76 54 32 1');
  });
});
