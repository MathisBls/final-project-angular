import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClickOutsideDirective } from './click-outside.directive';

@Component({
  template: `
    <div (appClickOutside)="onClickOutside()" data-testid="container">
      <button data-testid="inside-button">Inside Button</button>
    </div>
    <button data-testid="outside-button">Outside Button</button>
  `,
  standalone: true,
  imports: [ClickOutsideDirective],
})
class TestComponent {
  clickedOutside = false;

  onClickOutside(): void {
    this.clickedOutside = true;
  }
}

describe('ClickOutsideDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let containerElement: DebugElement;
  let insideButton: DebugElement;
  let outsideButton: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    containerElement = fixture.debugElement.query(
      By.css('[data-testid="container"]'),
    );
    insideButton = fixture.debugElement.query(
      By.css('[data-testid="inside-button"]'),
    );
    outsideButton = fixture.debugElement.query(
      By.css('[data-testid="outside-button"]'),
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not emit when clicking inside the element', () => {
    component.clickedOutside = false;

    insideButton.nativeElement.click();

    expect(component.clickedOutside).toBe(false);
  });

  it('should emit when clicking outside the element', () => {
    component.clickedOutside = false;

    outsideButton.nativeElement.click();

    expect(component.clickedOutside).toBe(true);
  });

  it('should not emit when clicking on the container element itself', () => {
    component.clickedOutside = false;

    containerElement.nativeElement.click();

    expect(component.clickedOutside).toBe(false);
  });

  it('should emit when clicking on document body', () => {
    component.clickedOutside = false;

    // Simulate clicking on document body
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(clickEvent, 'target', {
      value: document.body,
      writable: false,
    });

    document.dispatchEvent(clickEvent);

    expect(component.clickedOutside).toBe(true);
  });
});
