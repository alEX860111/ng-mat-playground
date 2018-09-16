import { Directive, HostListener, Renderer2, ElementRef, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { NumberParser } from './number-parser';

export const NUMBER_INPUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NumberInput),
  multi: true,
};

export interface NumberInputConfig {
  maxFractionDigits: number;
}

@Directive({
  selector: '[numberInput]',
  providers: [NUMBER_INPUT_VALUE_ACCESSOR, DecimalPipe, NumberParser]
})
export class NumberInput implements ControlValueAccessor {

  @Input('numberInput')
  set config(config: NumberInputConfig) {
    if (config) {
      this._config = config;
    } else {
      this._config = {
        maxFractionDigits: 2
      };
    }

  }
  get config(): NumberInputConfig {
    return this._config;
  }
  _config: NumberInputConfig;

  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
    private numberParser: NumberParser,
    private decimalPipe: DecimalPipe) {
  }

  @HostListener('blur', ['$event.target.value'])
  blur(value: string) {
    const parseResult = this.numberParser.parseNumber(value, this.config.maxFractionDigits);
    if (parseResult) {
      this.writeValueWithMinFractionDigits(parseResult.value, this.config.maxFractionDigits);
      this.onChange(parseResult.value);
      
    } else {
      this.onChange(null);
    }
    this.onTouched();
  }

  @HostListener('input', ['$event.target.value'])
  input(value: string) {
    const parseResult = this.numberParser.parseNumber(value, this.config.maxFractionDigits);
    if (parseResult) {
      this.writeValueWithMinFractionDigits(parseResult.value, parseResult.numFractionDigits);
      this.onChange(parseResult.value);
    } else {
      this.onChange(null);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event) {
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
    this.writeValueWithMinFractionDigits(value, 0);
  }

  private writeValueWithMinFractionDigits(value: any, minFractionDigits: number) {
    const element = this.element.nativeElement;

    this.renderer.setProperty(element, 'value', this.decimalPipe.transform(value, `1.${minFractionDigits}-${this.config.maxFractionDigits}`, 'de'));
  }

  registerOnChange(fn: (amount: number) => void): void {
    this.onChange = fn;
  }
  onChange = (_: number) => { };


  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  onTouched = () => { };

}
