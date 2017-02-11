import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: 'signin.component.html'
})
export class SignInComponent implements OnInit {

  titulo: string = "Identificate";
  formLogin: FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private _authService: AuthService, private _router: Router) {
  }

  ngOnInit(): any {

    this._authService.logout();

    this.formLogin = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {

    this._authService.signInUser(this.formLogin.value).subscribe(
      response => {
        if (response.token != null) {
          this.error = '';
          localStorage.setItem('id_token', response.token);
          //this._router.navigate(['/']);
          window.location.href = "/";
        }
      },
      error => {
        this.error = 'Invalid credentials';
      }
    );
  }

}
