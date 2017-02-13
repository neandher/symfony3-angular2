import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {NGValidators} from "ng-validators";
import {BaseComponent} from "./base.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: 'signin.component.html'
})
export class SignInComponent extends BaseComponent implements OnInit {

  public error: string[] = [];
  public form: FormGroup;
  public formErrors: Object = {
    'email': [],
    'password': [],
  };

  constructor(private fb: FormBuilder, private _authService: AuthService, private router: Router) {
    super();
  }

  ngOnInit(): any {
    this._authService.logout();
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
    this.error = [];
    this._authService.signInUser(this.form.value).subscribe(
      response => {
        if (response.token != null) {
          localStorage.setItem('id_token', response.token);
          this._authService.authSuccessEmitter.emit(true);
          this.router.navigate(['/']);
        }
        else {
          alert('Some Error!');
        }
      },
      responseError => {
        this.error = ['Invalid Credentials'];
      }
    );
  }

  onValueChanged() {
    this.handleError(this.form);
  }

}
