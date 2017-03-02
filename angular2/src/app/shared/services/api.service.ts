import {Injectable} from '@angular/core';
import {Response, URLSearchParams, Headers, RequestOptions, Http} from '@angular/http';

import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {AuthHttp} from "angular2-jwt";
import {User} from "../models/user";

@Injectable()
export class ApiService {

  constructor(private authHttp: AuthHttp, private http: Http) {
  }

  private formatErrors(error: any) {
    //console.log(error);
    return Observable.throw(error.json());
  }

  get(path: string,
      params: URLSearchParams = new URLSearchParams(),
      auth: boolean = true,
      deep: boolean = false): Observable<any> {
    if (deep) {
      params.append('deep', '1');
    }
    return (auth ? this.authHttp : this.http).get(`${environment.api_url}${path}`, {search: params})
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }

  put(path: string, body: Object = {}, auth: boolean = true): Observable<any> {
    return (auth ? this.authHttp : this.http).put(`${environment.api_url}${path}`, JSON.stringify(body))
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }

  post(path: string, body: Object = {}, auth: boolean = true): Observable<any> {
    return (auth ? this.authHttp : this.http).post(`${environment.api_url}${path}`, JSON.stringify(body))
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }

  delete(path, auth: boolean = true): Observable<any> {
    return (auth ? this.authHttp : this.http).delete(`${environment.api_url}${path}`)
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }

  signin(user: User) {
    let headers = new Headers();
    headers.append('Authorization', 'Basic ' + btoa(user.email + ':' + user.password));
    let options = new RequestOptions({headers: headers});

    return this.http.post(`${environment.api_url}` + '/auth/signin', null, options)
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }
}
