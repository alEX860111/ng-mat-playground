import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  form = new FormGroup({
    first: new FormControl(null, [Validators.required]),
    last: new FormControl(null, [Validators.required]),
    rent: new FormControl(null, [Validators.required]),
    income: new FormControl(null, [Validators.required])
  });

  onSubmit(): void {
    console.log(this.form.value);
  }
}
