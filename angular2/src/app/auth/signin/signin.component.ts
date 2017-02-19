import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";

import {NGValidators} from "ng-validators";
import {BaseComponent} from "../../base.component";
import {UserService} from "../../shared/services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: 'signin.component.html'
})
export class SignInComponent extends BaseComponent implements OnInit {

  isSubmitting: boolean = false;
  error: string[] = [];
  form: FormGroup;
  formErrors: Object = {
    'email': [],
    'password': [],
  };

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    super();
  }

  ngOnInit(): any {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, NGValidators.isEmail()]],
      password: ['', Validators.required],
    });
    this.form.valueChanges.subscribe(data => this.onValueChanged());
    this.onValueChanged();
  }

  onSubmit() {
    this.isSubmitting = true;
    this.error = [];
    this.userService.attemptAuth(this.form.value).subscribe(
      data => {
        this.router.navigateByUrl('/')
      },
      err => {
        this.error = ['Incorrect username or password.'];
        this.isSubmitting = false;
      }
    );
  }

  onValueChanged() {
    this.handleError(this.form);
  }

}
