import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from "@angular/http";
import {LogService} from "./log.service";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  public url = "http://localhost/symfony3-angular2/symfony/web/app_dev.php/api";

  constructor(private _http: Http, private _logService: LogService) {
  }

  signup(user) {

    let headers = new Headers();

    headers.append('Authorization', "Basic " +
      btoa(user.email + ":" + user.password));

    let options = new RequestOptions({headers: headers});

    return this._http.post(this.url + "/tokens", null, options)
      .map(res => res.json())
      .catch(this._logService.writeLog);
  }
}
