import {Injectable} from "@angular/core";

@Injectable()
export class JwtService {

  getToken(): string {
    return window.localStorage['id_token'];
  }

  saveToken(token: string) {
    window.localStorage['id_token'] = token;
  }

  destroyToken() {
    window.localStorage.removeItem('id_token');
  }
}
