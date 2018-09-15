import { Directive, HostListener, Renderer2, ElementRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

export const SPLITTER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SplitterDirective),
  multi: true,
};

@Directive({
  selector: '[splitterControl]',
  providers: [SPLITTER_VALUE_ACCESSOR, DecimalPipe]
})
export class SplitterDirective implements ControlValueAccessor {
  onChange;

  constructor(private renderer: Renderer2,
    private element: ElementRef,
    private decimalPipe: DecimalPipe) {
  }
  @HostListener('input', ['$event.target.value'])
  input(value: string) {
    value = value.replace(/[^\.\,\d]/g, '');
    value = value.replace(/\./g, '');
    var nth = 0;
    value = value.replace(/,/g, match => {
      nth++;
      return (nth === 1) ? match : '';
    });
    value = value.replace(/\,/g, '.');

    console.log('input', value);
    const indexOf = value.indexOf('.');

    if (indexOf === value.length - 1) {
      this.onChange(null);
      return;
    }

    if (indexOf === -1 && value.length > 0) {
      const parsed = Number(value);
      this.writeValue(parsed);
      this.onChange(parsed);
      return;
    }

    const matches = value.match(/(\d+\.\d{1,2})/);
    if (matches && matches[0]) {
      const parsedValue = Number(matches[0]);
      console.log(parsedValue);
      this.writeValue(parsedValue);
      this.onChange(parsedValue);
      return;
    }

    this.onChange(null);
  }

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent>event;
    if ([46, 8, 9, 27, 13, 110, 188].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  }

  writeValue(value: any): void {
    console.log('writeValue');
    const element = this.element.nativeElement;

    this.renderer.setProperty(element, 'value', this.decimalPipe.transform(value, '1.0-2', 'de'));
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  _onTouched = () => { };

}