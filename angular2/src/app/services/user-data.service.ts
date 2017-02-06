import {Injectable} from '@angular/core';
import {JwtHelper} from 'angular2-jwt';

@Injectable()
export class UserDataService {

  jwtHelper: JwtHelper = new JwtHelper();

  getUserData() {
    var token = localStorage.getItem('id_token');

    if (typeof token === "string" || token != null) {
      return this.jwtHelper.decodeToken(token)
    }
    else {
      return null;
    }
  }

}
