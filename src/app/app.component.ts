import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyTel } from './my-tel-input.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  form = new FormGroup({
    first: new FormControl('Nancy', [Validators.minLength(2), Validators.required]),
    last: new FormControl('Drew', [Validators.required]),
    tel: new FormControl(new MyTel('a', 'b', 'c'), [Validators.required])
  });

  onSubmit(): void {
    console.log(this.form.value);
  }
}
