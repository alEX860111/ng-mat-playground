import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, Input, OnDestroy, Optional, Self, forwardRef } from '@angular/core';
import { FormBuilder, FormGroup, ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';
import { Subject } from 'rxjs';

/** Data structure for holding telephone number. */
export class MyTel {
  constructor(public area: string, public exchange: string, public subscriber: string) { }
}


/** Custom `MatFormFieldControl` for telephone number input. */
@Component({
  selector: 'my-tel-input',
  templateUrl: 'form-field-custom-control-example.html',
  styleUrls: ['form-field-custom-control-example.css'],
  providers: [
    { provide: MatFormFieldControl, useExisting: MyTelInput }
  ],
  host: {
    '[class.floating]': 'shouldLabelFloat',
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy',
  }
})
export class MyTelInput implements MatFormFieldControl<MyTel>, OnDestroy, ControlValueAccessor {
  static nextId = 0;

  parts: FormGroup;
  stateChanges = new Subject<void>();
  focused = false;
  errorState = false;
  controlType = 'my-tel-input';
  id = `my-tel-input-${MyTelInput.nextId++}`;
  describedBy = '';

  get empty() {
    const { value: { area, exchange, subscriber } } = this.parts;

    return !area && !exchange && !subscriber;
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
  get value(): MyTel | null {
    console.log('get value');
    const { value: { area, exchange, subscriber } } = this.parts;
    if (area.length === 3 && exchange.length === 3 && subscriber.length === 4) {
      return new MyTel(area, exchange, subscriber);
    }
    return null;
  }
  set value(tel: MyTel | null) {
    console.log('set value', tel);
    const { area, exchange, subscriber } = tel || new MyTel('', '', '');
    this.parts.setValue({ area, exchange, subscriber });
    this.stateChanges.next();

    this._onChange(tel);
  }

  constructor(fb: FormBuilder, private fm: FocusMonitor, private elRef: ElementRef<HTMLElement>, @Optional() @Self() public ngControl: NgControl) {
    this.parts = fb.group({
      area: '',
      exchange: '',
      subscriber: '',
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

  writeValue(value: any): void {
    console.log('writeValue', value);
    if (value instanceof MyTel) {
      const myTel: MyTel = value;
      this.value = myTel;
    }
  }

  registerOnChange(fn: (_: any) => void): void {
    console.log('registerOnChange');
    this._onChange = fn;
  }

  _onChange = (_: any) => {};

  registerOnTouched(fn: any): void {
    console.log('registerOnTouched');
    this._onTouched = fn;
  }

  _onTouched = () => {};

}
