import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Component, DebugElement, LOCALE_ID } from '@angular/core';
import { NumberInputDirective } from './number-input';
import { By } from '@angular/platform-browser';

import { registerLocaleData } from '@angular/common';

import DE from '@angular/common/locales/de';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

registerLocaleData(DE);

@Component({
  template: `
  <form [formGroup]="form">
    <input numberInput formControlName="income">
  </form>
  `
})
class TestHostComponent {

  form = new FormGroup({
    income: new FormControl(null)
  });
}

describe('NumberInput', () => {

  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [NumberInputDirective, TestHostComponent],
      providers: [{ provide: LOCALE_ID, useValue: 'de' }]
    });
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
    fixture.detectChanges();
  });

  describe('should handle input event', () => {

    it('with valid number', () => {
      inputEl.triggerEventHandler('input', { target: { value: '1000,1' } });
      fixture.detectChanges();

      expect(inputEl.nativeElement.value).toEqual('1.000,1');
      expect(component.form.get('income').value).toEqual(1000.1);
    });

    it('with invalid number', () => {
      inputEl.triggerEventHandler('input', { target: { value: 'abc' } });
      fixture.detectChanges();

      expect(inputEl.nativeElement.value).toEqual('');
      expect(component.form.get('income').value).toBeNull();
    });

  });

  describe('should handle blur event', () => {

    it('with valid number', () => {
      inputEl.triggerEventHandler('blur', { target: { value: '1000,1' } });
      fixture.detectChanges();

      expect(inputEl.nativeElement.value).toEqual('1.000,10');
      expect(component.form.get('income').value).toEqual(1000.1);
    });

    it('with invalid number', () => {
      inputEl.triggerEventHandler('blur', { target: { value: 'abc' } });
      fixture.detectChanges();

      expect(inputEl.nativeElement.value).toEqual('');
      expect(component.form.get('income').value).toBeNull();
    });

  });

  describe('should handle keydown event', () => {

    let event;

    beforeEach(() => {
      event = {
        preventDefault: () => { }
      };
      spyOn(event, 'preventDefault');
    });

    it('and accept comma', () => {
      event.key = ',';
      inputEl.nativeElement.value = '99';
      inputEl.triggerEventHandler('keydown', event);

      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('and not accept comma if comma is already present', () => {
      event.key = ',';
      inputEl.nativeElement.value = '99,';
      inputEl.triggerEventHandler('keydown', event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('and not accept comma if value is empty', () => {
      event.key = ',';
      inputEl.nativeElement.value = '';
      inputEl.triggerEventHandler('keydown', event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

  });

});
