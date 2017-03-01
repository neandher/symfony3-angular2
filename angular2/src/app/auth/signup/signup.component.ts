import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";

import {NGValidators} from "ng-validators";
import {BaseComponent} from "../../base.component";
import {UserService} from "../../shared/services/user.service";
import {EqualPasswordsValidator} from "../../shared/validators/equalPasswords.validator";

@Component({
  selector: 'app-register',
  templateUrl: 'signup.component.html'
})
export class SignUpComponent extends BaseComponent implements OnInit {

  isSubmitting: boolean = false;
  status: string = "";
  error: string[] = [];
  form: FormGroup;
  submit: boolean = false;
  formErrors: Object = {
    'firstName': [],
    'lastName': [],
    'email': [],
    'plainPassword.first': [],
    'plainPassword.second': [],
  };

  constructor(private fb: FormBuilder, protected userService: UserService) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
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
          EqualPasswordsValidator.validate('plainPassword.first', 'plainPassword.second')]],
      })
    });

    this.form.valueChanges.subscribe(data => this.onValueChanged());
    this.onValueChanged();
  }

  onSubmit() {
    this.isSubmitting = true;
    this.error = [];

    this.userService.attemptRegister(this.form.value).subscribe(
      response => {
        this.submit = true;
        this.status = 'success';
      },
      responseError => {
        this.isSubmitting = false;
        this.handleResponseError(responseError.errors);
      }
    );
  }

  onValueChanged() {
    this.handleError(this.form);
  }
}
