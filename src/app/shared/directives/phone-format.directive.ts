import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appPhoneFormat]',
  standalone: true,
})
export class PhoneFormatDirective {
  private elementRef = inject(ElementRef);

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 0) {
      if (value.startsWith('33')) {
        value = value.substring(2);
      }

      if (value.length <= 9) {
        value = value.replace(
          /(\d{2})(\d{2})(\d{2})(\d{2})(\d+)/,
          '$1 $2 $3 $4 $5',
        );
      }

      value = '+33 ' + value;
    }

    input.value = value;
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');

    if (value.length < 10) {
      input.classList.add('border-red-500');
    } else {
      input.classList.remove('border-red-500');
    }
  }
}
