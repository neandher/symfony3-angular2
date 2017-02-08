import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {NGValidators} from 'ng-validators';
import {AuthService} from "../services/auth.service";
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  titulo: string = "Register";
  status: string = "";
  error: string;
  myForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService) {
  }

  ngOnInit() {

    this.myForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([
        Validators.required,
        NGValidators.isEmail()
      ])],
      plainPassword: this.fb.group({
        first: ['', Validators.required],
        second: ['', Validators.required],
      }),
    });

    this.subscribeToFormChangesAndSetValidity();
  }

  subscribeToFormChangesAndSetValidity() {
    const myFormValueChanges$ = this.myForm.controls["plainPassword"].valueChanges;

    myFormValueChanges$.subscribe(x => {
      if (this.myForm.controls["plainPassword"].valid) {
        if (x.first === x.second) {
          this.myForm.controls["plainPassword"].get('second').setErrors(null);
        } else {
          this.myForm.controls["plainPassword"].get('second').setErrors({"mismatch": true});
        }
      }
    });
  }

  onSubmit() {
    this.auth.signupUser(this.myForm.value).subscribe(
      response => {
        console.log('success');
        console.log(response);
      },
      error => {
        var errorResponse = error.json().errors;

        for(let fieldNameError in errorResponse){
          for(let msgError of errorResponse[fieldNameError]){
            this.myForm.controls[fieldNameError].setErrors({"response_error": true});
            this.error = msgError;
          }
        }
      }
    );
  }
}
