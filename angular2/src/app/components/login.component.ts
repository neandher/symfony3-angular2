import {Component, OnInit} from '@angular/core';
import {LogService} from "../services/log.service";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './../view/login.html',
  providers: [LogService]
})
export class LoginComponent implements OnInit {

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

    this._authService.login(this.formLogin.value).subscribe(
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
