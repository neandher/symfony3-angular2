import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "./base.component";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {User} from "../models/user";
import {AuthService} from "../auth/auth.service";
import {EqualPasswordsValidator} from "../validators/equalPasswords.validator";

@Component({
  selector: 'app-user-change-password',
  templateUrl: './user-change-password.component.html'
})
export class UserChangePasswordComponent extends BaseComponent implements OnInit {

  public user: User;
  public status: string = "";
  public error: string[] = [];
  public form: FormGroup;
  public submit: boolean = false;
  public formErrors: Object = {
    'current_password': [],
    'plainPassword.first': [],
    'plainPassword.second': [],
  };

  constructor(private fb: FormBuilder, protected auth: AuthService) {
    super();
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      current_password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(24)]],
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

  onValueChanged() {
    this.handleError(this.form);
  }

  onSubmit() {
    this.error = [];

    this.auth.changePassword(this.form.value).subscribe(
      response => {
        this.submit = true;
        this.status = 'success';
      },
      responseError => {
        this.handleResponseError(responseError.json().errors);
      }
    );
  }

}
