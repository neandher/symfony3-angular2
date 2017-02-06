import { Injectable } from '@angular/core';
import {Headers, RequestOptions, Http} from "@angular/http";
import { tokenNotExpired } from 'angular2-jwt';
import {LogService} from "./log.service";
import {myConfig} from "../auth.config";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {User} from "../models/user";

@Injectable()
export class AuthService {

  constructor(private _http: Http, private _logService: LogService) {
  }

  login(user: User){
    let headers = new Headers();

    headers.append('Authorization', "Basic " +
      btoa(user.email + ":" + user.password));

    let options = new RequestOptions({headers: headers});

    return this._http.post(myConfig.url + "/tokens", null, options)
      .map(res => res.json())
      .catch(this._logService.writeLog);
  }

  logout(){
    localStorage.removeItem('id_token');
  }

  loggedIn() {
    return tokenNotExpired();
  }
}
