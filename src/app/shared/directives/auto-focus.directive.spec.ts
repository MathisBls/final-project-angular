import { Component, DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AutoFocusDirective } from './auto-focus.directive';

@Component({
  template: `
    <input [appAutoFocus]="shouldFocus" [delay]="focusDelay" />
    <input appAutoFocus />
    <input [appAutoFocus]="false" />
  `,
  standalone: true,
  imports: [AutoFocusDirective],
})
class TestComponent {
  shouldFocus = true;
  focusDelay = 100;
}

describe('AutoFocusDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputElements: DebugElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputElements = fixture.debugElement.queryAll(By.css('input'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should focus element when appAutoFocus is true', fakeAsync(() => {
    spyOn(inputElements[0].nativeElement, 'focus');
    fixture.detectChanges();

    tick(100); // Wait for the delay

    expect(inputElements[0].nativeElement.focus).toHaveBeenCalled();
  }));

  it('should focus element immediately when no delay is specified', fakeAsync(() => {
    spyOn(inputElements[1].nativeElement, 'focus');
    fixture.detectChanges();

    tick(0); // No delay

    expect(inputElements[1].nativeElement.focus).toHaveBeenCalled();
  }));

  it('should not focus element when appAutoFocus is false', fakeAsync(() => {
    spyOn(inputElements[2].nativeElement, 'focus');
    fixture.detectChanges();

    tick(100);

    expect(inputElements[2].nativeElement.focus).not.toHaveBeenCalled();
  }));

  it('should not focus when shouldFocus is set to false', fakeAsync(() => {
    component.shouldFocus = false;
    spyOn(inputElements[0].nativeElement, 'focus');
    fixture.detectChanges();

    tick(100);

    expect(inputElements[0].nativeElement.focus).not.toHaveBeenCalled();
  }));

  it('should respect custom delay', fakeAsync(() => {
    component.focusDelay = 500;
    spyOn(inputElements[0].nativeElement, 'focus');
    fixture.detectChanges();

    tick(400); // Wait less than the delay
    expect(inputElements[0].nativeElement.focus).not.toHaveBeenCalled();

    tick(100); // Complete the delay
    expect(inputElements[0].nativeElement.focus).toHaveBeenCalled();
  }));
});
