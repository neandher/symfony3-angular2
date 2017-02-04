import {Component, OnInit} from '@angular/core';
import {LoginService} from "../services/login.service";

@Component({
  selector: 'app-login',
  templateUrl: './../view/login.html',
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  public titulo: string = "Identificate";
  public user = {"email": "", "password": "", "gethash": ""};
  public errorMessage;

  constructor(private _loginService: LoginService) {
  }

  ngOnInit() {
  }

  onSubmit() {

    //console.log(this.user);

    this._loginService.signup(this.user).subscribe(
      response => {
        alert(response)
      }/*,
      error => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la peticion")
        }
      }*/
    );
  }

}
