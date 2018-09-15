import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';

import DE from '@angular/common/locales/de';

registerLocaleData(DE);

import { AppComponent } from './app.component';
import { MatToolbarModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule } from '@angular/material';

import { ReactiveFormsModule } from '@angular/forms';
import { MoneyAmountInput } from './money-amount-input.component';
import { OnlyNumber } from './only-number';
import { SplitterDirective } from './currency-input';

@NgModule({
  declarations: [
    AppComponent, MoneyAmountInput, OnlyNumber, SplitterDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'de' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
