import {Component, OnInit} from '@angular/core';

import {BaseComponent} from "../../base.component";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {NGValidators} from "ng-validators";
import {User} from "../../models/user";
import {UserService} from "../../shared/services/user.service";

@Component({
  selector: 'app-user-edit',
  templateUrl: 'user-edit.component.html'
})
export class UserEditComponent extends BaseComponent implements OnInit {

  isSubmiting: boolean = false;
  user: User;
  status: string = '';
  error: string[] = [];
  form: FormGroup;
  submit: boolean = false;
  formErrors: Object = {
    'firstName': [],
    'lastName': [],
    'email': [],
  };

  constructor(private fb: FormBuilder, protected userService: UserService) {
    super();
  }

  ngOnInit() {
    this.buildForm();
    this.userService.currentUser.subscribe(
      (userData) => {
        this.user = userData;
      }
    );
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
    this.isSubmiting = true;
    this.error = [];

    this.userService.update(this.form.value).subscribe(
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
