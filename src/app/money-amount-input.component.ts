import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, Input, OnDestroy, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NgControl, Validators } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';
import { Subject } from 'rxjs';

/** Data structure for holding telephone number. */
export class MoneyAmount {
  constructor(public integerPart: string, public fractionalPart: string) { }
}


/** Custom `MatFormFieldControl` for telephone number input. */
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
export class MoneyAmountInput implements MatFormFieldControl<MoneyAmount>, OnDestroy, ControlValueAccessor {
  static nextId = 0;

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
  get value(): MoneyAmount | null {
    console.log('get value');
    if (this.parts.valid) {
      const { value: { integerPart, fractionalPart } } = this.parts;
      return new MoneyAmount(integerPart, fractionalPart);
    }
    return null;
  }
  set value(tel: MoneyAmount | null) {
    console.log('set value', tel);
    if (tel !== null) {
      this.parts.setValue({ integerPart: tel.integerPart, fractionalPart: tel.fractionalPart });

    } else {
      this.parts.setValue({ integerPart: null, fractionalPart: '99' });

    }
    //const { integerPart, fractionalPart } = tel || new MoneyAmount('', '');
    //this.parts.setValue({ integerPart, fractionalPart });
    this.stateChanges.next();

    this._onChange(tel);
  }

  constructor(fb: FormBuilder, private fm: FocusMonitor, private elRef: ElementRef<HTMLElement>, @Optional() @Self() public ngControl: NgControl) {
    const integerPartControl = new FormControl(null, [Validators.pattern(/^\d+$/), Validators.required]);
    const fractionalPartControl = new FormControl('00', [Validators.pattern(/^\d{1,2}$/), Validators.required]);
    this.parts = new FormGroup({
      integerPart: integerPartControl,
      fractionalPart: fractionalPartControl
    });
    // this.parts = fb.group({
    //   integerPart: 1,
    //   fractionalPart: ''
    // });

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

  writeValue(value: MoneyAmount): void {
    console.log('writeValue', value);
    if (value instanceof MoneyAmount) {
      const myTel: MoneyAmount = value;
      this.value = myTel;
    }
  }

  registerOnChange(fn: (myTel: MoneyAmount) => void): void {
    console.log('registerOnChange');
    this._onChange = fn;
  }
  _onChange = (_: MoneyAmount) => { };

  registerOnTouched(fn: any): void {
    console.log('registerOnTouched');
    this._onTouched = fn;
  }
  _onTouched = () => { };

}
