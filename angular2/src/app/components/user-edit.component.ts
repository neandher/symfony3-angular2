import {Component, OnInit} from '@angular/core';
import {User} from "../models/user";
import {AuthService} from "../auth/auth.service";
import {BaseComponent} from "./base.component";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {NGValidators} from "ng-validators";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html'
})
export class UserEditComponent extends BaseComponent implements OnInit {

  public user: User;
  public status: string = "";
  public error: string[] = [];
  public form: FormGroup;
  public submit: boolean = false;
  public formErrors: Object = {
    'firstName': [],
    'lastName': [],
    'email': [],
  };

  constructor(private fb: FormBuilder, protected auth: AuthService) {
    super();
  }

  ngOnInit() {
    this.buildForm();
    this.user = this.auth.getUserData();
  }

  buildForm(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(24)]],
      lastName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(24)]],
      email: ['', [Validators.required, NGValidators.isEmail()]],
    });

    this.form.valueChanges.subscribe(data => this.onValueChanged());
    this.onValueChanged();
  }

  onSubmit() {
    this.error = [];

    this.auth.updateUser(this.form.value).subscribe(
      response => {
        this.submit = true;
        this.status = 'success';
      },
      responseError => {
        console.log(responseError);
        this.handleResponseError(responseError.json().errors);
      }
    );
  }

  onValueChanged() {
    this.handleError(this.form);
  }

}
