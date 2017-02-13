import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {NGValidators} from "ng-validators";
import {AuthService} from "../auth/auth.service";
import {EqualPasswordsValidator} from "../validators/equalPasswords.validator";
import {BaseComponent} from "./base.component";

@Component({
  selector: 'app-register',
  templateUrl: 'signup.component.html'
})
export class SignUpComponent extends BaseComponent implements OnInit {

  public status: string = "";
  public error: string[] = [];
  public form: FormGroup;
  public submit: boolean = false;
  public formErrors: Object = {
    'firstName': [],
    'lastName': [],
    'email': [],
    'plainPassword.first': [],
    'plainPassword.second': [],
  };

  constructor(private fb: FormBuilder, protected auth: AuthService) {
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
          EqualPasswordsValidator.validate('plainPassword', 'first', 'second')]],
      }),
      isEnabled: [''],
    });

    this.form.get('isEnabled').setValue(true);
    this.form.valueChanges.subscribe(data => this.onValueChanged());
    this.onValueChanged();
  }

  onSubmit() {
    this.error = [];

    this.auth.signupUser(this.form.value).subscribe(
      response => {
        this.submit = true;
        this.status = 'success';
      },
      responseError => {
        this.handleResponseError(responseError.json().errors);
      }
    );
  }

  onValueChanged() {
    this.handleError(this.form);
  }
}
