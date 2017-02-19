import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";

import {BaseComponent} from "../../base.component";
import {User} from "../../models/user";
import {EqualPasswordsValidator} from "../../validators/equalPasswords.validator";
import {UserService} from "../../shared/services/user.service";

@Component({
  selector: 'app-user-change-password',
  templateUrl: 'user-change-password.component.html'
})
export class UserChangePasswordComponent extends BaseComponent implements OnInit {

  isSubmitting: boolean = false;
  user: User;
  status: string = '';
  error: string[] = [];
  form: FormGroup;
  submit: boolean = false;
  formErrors: Object = {
    'current_password': [],
    'plainPassword.first': [],
    'plainPassword.second': [],
  };

  constructor(private fb: FormBuilder, protected userService: UserService) {
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
    this.isSubmitting = true;
    this.error = [];

    this.userService.changePassword(this.form.value).subscribe(
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

}
