import {Injectable} from '@angular/core';
import {CanActivate, Router, CanLoad, Route} from '@angular/router';
import {tokenNotExpired} from 'angular2-jwt';
import {Observable} from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private router: Router) {
  }

  canActivate() {
    return this.isAuthenticated();
  }

  canLoad(route: Route): Observable<boolean>|Promise<boolean>|boolean {
    return this.isAuthenticated();
  }

  private isAuthenticated() {
    if (tokenNotExpired()) {
      return true;
    } else {
      this.router.navigate(['/auth/signin']);
      return false;
    }
  }
}
