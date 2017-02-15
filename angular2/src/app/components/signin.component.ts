import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
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

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    super();
  }

  ngOnInit(): any {
    this.auth.logout();
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
    this.auth.signIn(this.form.value).subscribe(
      response => {
        if (response.token != null) {
          localStorage.setItem('id_token', response.token);
          this.auth.authSuccessEmitter.emit(true);
          this.router.navigate(['/']);
        }
        else {
          alert('Some Error!');
        }
      },
      responseError => {
        console.log(responseError);
        this.error = ['Invalid Credentials'];
      }
    );
  }

  onValueChanged() {
    this.handleError(this.form);
  }

}
