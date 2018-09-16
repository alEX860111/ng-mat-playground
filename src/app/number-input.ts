import { Directive, HostListener, Renderer2, ElementRef, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { NumberParser } from './number-parser';
import { NumberInputConfig } from './number-input-config';

export const NUMBER_INPUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NumberInputDirective),
  multi: true,
};

@Directive({
  selector: '[numberInput]',
  providers: [NUMBER_INPUT_VALUE_ACCESSOR, DecimalPipe, NumberParser]
})
export class NumberInputDirective implements ControlValueAccessor {

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
  private _config: NumberInputConfig;

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
  keydown(e: KeyboardEvent) {
    if (e.key === ',') {
      if (this.element.nativeElement.value.indexOf(',') !== -1 || !this.element.nativeElement.value) {
        e.preventDefault();
      }
      return;
    }

    if ([
      'ArrowLeft', 'ArrowRight', 'Backspace', 'Tab', 'Delete', 'Home', 'End', 'Enter',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ].includes(e.key)) {
      return;
    }

    if (['a', 'c', 'v', 'x'].includes(e.key) && (e.ctrlKey || e.metaKey)) {
      return;
    }

    e.preventDefault();
  }

  writeValue(value: any): void {
    this.writeValueWithMinFractionDigits(value, this.config.maxFractionDigits);
  }

  private writeValueWithMinFractionDigits(value: any, minFractionDigits: number) {
    const element = this.element.nativeElement;
    const digitsInfo = `1.${minFractionDigits}-${this.config.maxFractionDigits}`;
    const transformedValue = this.decimalPipe.transform(value, digitsInfo, 'de');
    this.renderer.setProperty(element, 'value', transformedValue);
  }

  registerOnChange(fn: (_: number) => void): void {
    this.onChange = fn;
  }
  private onChange = (_: number) => { };


  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  private onTouched = () => { };

}
