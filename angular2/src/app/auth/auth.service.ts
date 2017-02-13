import {Injectable, OnInit, EventEmitter} from '@angular/core';
import {Headers, RequestOptions, Http, Response} from "@angular/http";
import {tokenNotExpired, AuthHttp} from 'angular2-jwt';
import {myConfig} from "../auth.config";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {User} from "../models/user";
import {JwtHelper} from 'angular2-jwt';

@Injectable()
export class AuthService implements OnInit {

  public authSuccessEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private _http: Http, private authHttp: AuthHttp) {
  }

  ngOnInit(): void {

  }

  signInUser(user: User) {
    let headers = new Headers();

    headers.append('Authorization', "Basic " +
      btoa(user.email + ":" + user.password));

    let options = new RequestOptions({headers: headers});

    return this._http.post(myConfig.url + "/auth/signin", null, options)
      .map(res => res.json());
  }

  authSuccess(isAuthSuccess: boolean) {
    this.authSuccessEmitter.emit(isAuthSuccess);
  }

  logout() {
    localStorage.removeItem('id_token');
  }

  loggedIn() {
    return tokenNotExpired();
  }

  signupUser(user: User) {
    let json = JSON.stringify(user);
    return this._http.post(myConfig.url + "/auth/signup", json, null)
      .map((response: Response) => response.json());
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

  updateUser(user: User) {
    let json = JSON.stringify(user);
    return this.authHttp.put(myConfig.url + "/users/"+user.email, json)
      .map((response: Response) => response.json());
  }

}
