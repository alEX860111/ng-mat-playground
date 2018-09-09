import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MatToolbarModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule } from '@angular/material';

import { ReactiveFormsModule } from '@angular/forms';
import { MoneyAmountInput } from './money-amount-input.component';
import { OnlyNumber } from './only-number';

@NgModule({
  declarations: [
    AppComponent, MoneyAmountInput, OnlyNumber
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, MatIconModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
