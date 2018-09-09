import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, Input, OnDestroy, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NgControl, Validators } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';
import { Subject } from 'rxjs';

@Component({
  selector: 'money-amount-input',
  templateUrl: 'money-amount-input.component.html',
  styleUrls: ['money-amount-input.component.css'],
  providers: [
    { provide: MatFormFieldControl, useExisting: MoneyAmountInput }
  ],
  host: {
    '[class.floating]': 'shouldLabelFloat',
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy',
  }
})
export class MoneyAmountInput implements MatFormFieldControl<number>, OnDestroy, ControlValueAccessor {
  static nextId = 0;

  private static readonly DEFAULT_INTEGER_PART = null;

  private static readonly DEFAULT_FRACTIONALPART = '00';

  parts: FormGroup;
  stateChanges = new Subject<void>();
  focused = false;
  controlType = 'money-amount-input';
  id = `money-amount-input-${MoneyAmountInput.nextId++}`;
  describedBy = '';

  get errorState() {
    return !this.parts.valid && this.parts.touched;
  }

  get empty() {
    const { value: { integerPart, fractionalPart } } = this.parts;
    return !integerPart && !fractionalPart;
  }

  get shouldLabelFloat() { return this.focused || !this.empty; }

  @Input()
  get placeholder(): string { return this._placeholder; }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string;

  @Input()
  get required(): boolean { return this._required; }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get value(): number | null {
    if (this.parts.valid) {
      const { value: { integerPart, fractionalPart } } = this.parts;
      return Number(`${integerPart}.${fractionalPart}`);
    }
    return null;
  }
  set value(amount: number | null) {
    if (amount !== null) {
      const split = String(amount).split('.')
      this.parts.setValue({ integerPart: split[0], fractionalPart: split[1] });

    } else {
      this.parts.setValue({ integerPart: MoneyAmountInput.DEFAULT_INTEGER_PART, fractionalPart: MoneyAmountInput.DEFAULT_FRACTIONALPART });

    }
    this.stateChanges.next();
    this._onChange(amount);
  }

  constructor(private fm: FocusMonitor, private elRef: ElementRef<HTMLElement>, @Optional() @Self() public ngControl: NgControl) {
    const integerPartControl = new FormControl(MoneyAmountInput.DEFAULT_INTEGER_PART, [Validators.pattern(/^\d+$/), Validators.required]);
    const fractionalPartControl = new FormControl(MoneyAmountInput.DEFAULT_FRACTIONALPART, [Validators.pattern(/^\d{1,2}$/), Validators.required]);
    this.parts = new FormGroup({
      integerPart: integerPartControl,
      fractionalPart: fractionalPartControl
    });

    this.parts.valueChanges.subscribe(() => {
      this._onChange(this.value);
    });

    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });

    if (this.ngControl != null) { this.ngControl.valueAccessor = this; }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this.elRef.nativeElement.querySelector('input')!.focus();
    }
  }

  writeValue(value: number): void {
    this.value = value;
  }

  registerOnChange(fn: (amount: number) => void): void {
    this._onChange = fn;
  }
  _onChange = (_: number) => { };

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  _onTouched = () => { };

}
