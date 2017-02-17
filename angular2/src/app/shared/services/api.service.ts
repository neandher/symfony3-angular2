import {Injectable} from '@angular/core';
import {Response, URLSearchParams, Headers, RequestOptions, Http} from '@angular/http';

import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {AuthHttp} from "angular2-jwt";
import {User} from "../../models/user";

@Injectable()
export class ApiService {
  constructor(private authHttp: AuthHttp,
              private http: Http) {
  }

  private formatErrors(error: any) {
    return Observable.throw(error.json());
  }

  get(path: string, params: URLSearchParams = new URLSearchParams()): Observable<any> {
    return this.authHttp.get(`${environment.api_url}${path}`, {search: params})
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.authHttp.put(`${environment.api_url}${path}`, JSON.stringify(body))
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.authHttp.post(`${environment.api_url}${path}`, JSON.stringify(body))
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }

  delete(path): Observable<any> {
    return this.authHttp.delete(`${environment.api_url}${path}`)
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
