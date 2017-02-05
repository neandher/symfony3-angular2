import {Component, OnInit} from '@angular/core';
import {LoginService} from "../services/login.service";
import {LogService} from "../services/log.service";

@Component({
  selector: 'app-login',
  templateUrl: './../view/login.html',
  providers: [LoginService, LogService]
})
export class LoginComponent implements OnInit {

  public titulo: string = "Identificate";
  public user = {"email": "", "password": "", "gethash": ""};

  constructor(private _loginService: LoginService) {
  }

  ngOnInit() {
  }

  onSubmit() {

    this._loginService.signup(this.user).subscribe(
      response => {
        console.log(response)
      }
    );
  }

}
