import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MatToolbarModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule } from '@angular/material';

import { ReactiveFormsModule } from '@angular/forms';
import { MyTelInput } from './my-tel-input.component';

@NgModule({
  declarations: [
    AppComponent, MyTelInput
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, MatIconModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
