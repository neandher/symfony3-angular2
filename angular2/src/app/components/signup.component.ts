import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl, FormControl} from "@angular/forms";
import {NGValidators} from 'ng-validators';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {EqualPasswordsValidator} from "../validators/equalPasswords.validator";
import {BaseComponent} from "./base.component";

@Component({
  selector: 'app-register',
  templateUrl: 'signup.component.html'
})
export class SignUpComponent extends BaseComponent implements OnInit {

  status: string = "";
  errorAlert: string[] = [];
  public form: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  onSubmit() {
    this.auth.signupUser(this.form.value).subscribe(
      response => {
        this.router.navigate(['/signInUser']);
      },
      responseError => {
        this.errorAlert = [];
        this.handleResponseError(responseError.json().errors);
      }
    );
  }

  handleResponseError(responseError: any[]) {
    for (let index in responseError) {
      var check = 0;
      for (let item of responseError[index]) {
        this.errorAlert.push(item);
        var pathFormError = this.getPathFormError(this.form.get(index));
        console.log(index);
        console.log(pathFormError);
        this.form.get((pathFormError)).setErrors({"response_index": item});
        check++;
      }
      if (check == 0) {
        this.handleResponseError(responseError[index]);
      }
    }
    this.onValueChanged();
  }

  buildForm(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(24)]],
      lastName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(24)]],
      email: ['', [Validators.required, NGValidators.isEmail()]],
      plainPassword: this.fb.group({
        first: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(24)]],
        second: ['', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(24),
          EqualPasswordsValidator.validate('plainPassword', 'first', 'second')]],
      }),
    });

    this.form.valueChanges.subscribe(data => this.onValueChanged());
    this.onValueChanged();
  }

  onValueChanged() {
    this.handleError(this.form);
  }

  handleError(control: any) {

    const pathFormError = this.getPathFormError(control);

    for (let error in control.errors) {
      if (this.formErrors[(pathFormError)].indexOf(this.validationMessages[error]) == -1) {
        this.formErrors[(pathFormError)].push(this.validationMessages[error]);
      }
    }
    for (var child in control.controls) {
      if (control.controls[child] instanceof FormControl) {
        this.formErrors[(this.getPathFormError(control.controls[child]))] = [];
        if (control.controls[child].dirty && !control.controls[child].valid) {
          this.handleError(control.controls[child]);
        }
      }
      else {
        this.handleError(control.controls[child]);
      }
    }
  }

  getPathFormError(control) {
    var path: string = '';
    var parent = control.parent;

    while (parent instanceof FormGroup) {
      Object.keys(parent.controls).forEach((name) => {
        if (control === parent.controls[name]) {
          path += name + '.';
          control = parent;
        }
      });
      parent = parent.parent;
    }

    path = path.substr(0, (path.length - 1));
    var dotted = path.indexOf('.');

    if (dotted != -1) {
      var orderedArray: string[] = path.split('.');
      orderedArray = orderedArray.reverse();
      path = '';
      for (let i = 0; i < orderedArray.length; i++) {
        path += orderedArray[i] + '.';
      }
      path = path.substr(0, (path.length - 1));
    }

    return path;
  }

  formErrors: Object = {
    'firstName': [],
    'lastName': [],
    'email': [],
    'plainPassword.first': [],
    'plainPassword.second': [],
  };

  validationMessages: Object = {
    'response_error': '',
    'required': 'This field is required.',
    'minlength': 'This field must be at least 4 characters long.',
    'maxlength': 'This field cannot be more than 24 characters long.',
    'passwordsEqual': 'Password mismatch.',
    'isEmail': 'Email invalid.'
  };
}


/*
 handleError(control: any) {

 var _errors: Object[] = [];
 for (let error in control.errors) {
 _errors.push(this.validationMessages[error]);
 var pathFormError = this.getPathFormError(control);
 this.formErrors[(pathFormError)] = error;
 }

 for (var child in control.controls) {
 if (control.controls[child] instanceof AbstractControl && control.controls[child].dirty && !control.controls[child].valid) {
 var childErrors = this.handleError(control.controls[child]);
 if (childErrors) {
 var t: Object[] = [];
 t[child] = childErrors;
 _errors.push(t);
 }
 }
 }

 return _errors;
 }
 */
