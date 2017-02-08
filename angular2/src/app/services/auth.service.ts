import {Injectable} from '@angular/core';
import {Headers, RequestOptions, Http, Response} from "@angular/http";
import {tokenNotExpired} from 'angular2-jwt';
import {LogService} from "./log.service";
import {myConfig} from "../auth.config";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {User} from "../models/user";
import {JwtHelper} from 'angular2-jwt';

@Injectable()
export class AuthService {

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private _http: Http, private _logService: LogService) {
  }

  login(user: User) {
    let headers = new Headers();

    headers.append('Authorization', "Basic " +
      btoa(user.email + ":" + user.password));

    let options = new RequestOptions({headers: headers});

    return this._http.post(myConfig.url + "/auth/signin", null, options)
      .map(res => res.json())
      .catch(this._logService.writeLog);
  }

  logout() {
    localStorage.removeItem('id_token');
  }

  loggedIn() {
    return tokenNotExpired();
  }

  getUserData() {
    var token = localStorage.getItem('id_token');

    if (typeof token === "string" || token != null) {
      return this.jwtHelper.decodeToken(token)
    }
    else {
      return null;
    }
  }

  signupUser(user: User) {
    let json = JSON.stringify(user);
    return this._http.post(myConfig.url + "/auth/signup", json, null)
      .map((response: Response) => response.json());
      //.catch(this._logService.writeLog);
      //.catch(this.handleError);
  }

}
