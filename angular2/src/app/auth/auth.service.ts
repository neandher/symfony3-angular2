import {Injectable, OnInit, EventEmitter} from '@angular/core';
import {Headers, RequestOptions, Http, Response} from "@angular/http";
import {tokenNotExpired, AuthHttp} from 'angular2-jwt';
import {appConfig} from "../app.config";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {User} from "../models/user";
import {JwtHelper} from 'angular2-jwt';

@Injectable()
export class AuthService implements OnInit {

  public authSuccessEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  private jwtHelper: JwtHelper = new JwtHelper();

  constructor(private http: Http, private authHttp: AuthHttp) {
  }

  ngOnInit(): void {
  }

  signIn(user: User) {

    let headers = new Headers();

    headers.append('Authorization', "Basic " + btoa(user.email + ":" + user.password));

    let options = new RequestOptions({headers: headers});

    return this.http.post(appConfig.apiUrl + "/auth/signin", null, options)
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

  signUp(user: User) {

    let json = JSON.stringify(user);
    let url = appConfig.apiUrl + "/auth/signup";

    return this.http.post(url, json, null)
      .map((response: Response) => response.json());
  }

  getUserData() {

    let token = localStorage.getItem('id_token');

    if (typeof token === "string" || token != null) {
      return this.jwtHelper.decodeToken(token)
    }
    else {
      return null;
    }
  }

  updateUser(user: User) {

    let json = JSON.stringify(user);
    let url = appConfig.apiUrl + "/users/" + user.email;

    return this.authHttp.put(url, json)
      .map((response: Response) => response.json());
  }

  changePassword(user: User){

    let userEmail = this.getUserData().email;
    let json = JSON.stringify(user);
    let url = appConfig.apiUrl + "/users/" + userEmail + "/change-password";

    return this.authHttp.put(url, json)
      .map((response: Response) => response.json());
  }

}
