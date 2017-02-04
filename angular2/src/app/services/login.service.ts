import { Injectable } from '@angular/core';
import {Headers, Http} from "@angular/http";
import "rxjs/add/operator/map";
import {Observable} from "rxjs/Observable";

@Injectable()
export class LoginService {

  public url = "http://localhost/symfony3-angular2/symfony/web/app_dev.php";

  constructor(private _http: Http) {}

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa('username:password'));
  }

  signup(user_to_login){
    let json = JSON.stringify(user_to_login);
    let headers = new Headers({'Content-Type': 'application/json'});

    this.createAuthorizationHeader(headers);

    return this._http.post(this.url+"/tokens", json, {headers: headers})
      .map(res => res.json());
  }

}
