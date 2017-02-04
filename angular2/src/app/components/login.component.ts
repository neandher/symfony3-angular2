import {Component} from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './../view/login.html',
})
export class LoginComponent  {

  public titulo: string = "Identificate";
  user = {
    "email": "",
    "password": "",
    "gethash": ""
  };

  onSubmit(){
    console.log(this.user);
  }

}
