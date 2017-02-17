import {Injectable} from "@angular/core";
import {Observable, ReplaySubject, BehaviorSubject} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {User} from "../../models/user";
import {ApiService} from "./api.service";
import {JwtService} from "./jwt.service";
import {JwtHelper} from "angular2-jwt";

@Injectable()
export class UserService {

  private currentUserSubject = new BehaviorSubject<User>(new User());
  public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  public jwtHelper = new JwtHelper();

  constructor(private apiService: ApiService,
              private jwtService: JwtService) {
  }

  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    let token: string = this.jwtService.getToken();
    // If JWT detected, attempt to get & store user's info
    if (token) {
      let user: User = this.jwtHelper.decodeToken(token);
      this.apiService.get('/users/' + user.email)
        .subscribe(
          data => {
            this.setAuth(data, token);
          },
          err => {
            this.purgeAuth();
          }
        );
    } else {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

  setAuth(user: User, token: string = '') {
    // Save JWT sent from server in localstorage
    if (token != '') {
      this.jwtService.saveToken(token);
    }
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next(new User());
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  attemptAuth(user: User): Observable<User> {
    return this.apiService.signin(user)
      .map(
        data => {
          this.setAuth(this.jwtHelper.decodeToken(data.token), data.token);
          return data.token;
        }
      );
  }

  attemptRegister(user: User): Observable<User> {
    return this.apiService.post('/users', user)
      .map(
        userResponse => {
          return userResponse;
        }
      );
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  // Update the user on the server (email, pass, etc)
  update(user: User): Observable<User> {
    return this.apiService
      .put('/users/' + user.email, user)
      .map(userUpdated => {
        // Update the currentUser observable
        this.currentUserSubject.next(userUpdated);
        return userUpdated;
      });
  }

  changePassword(user: User): Observable<User> {
    return this.apiService
      .put('/users/' + user.email + '/change-password', user)
      .map(userUpdated => {
        // Update the currentUser observable
        this.currentUserSubject.next(userUpdated);
        return userUpdated;
      });
  }
}
