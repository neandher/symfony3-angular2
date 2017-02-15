import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import {User} from "../models/user";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {

  public user: User;

  constructor(private auth: AuthService, private router: Router) {
  }

  ngOnInit(): void {

    this.user = this.auth.getUserData();

    this.auth.authSuccessEmitter.subscribe(
      (isAuthSeccess: boolean) => {
        if (isAuthSeccess) {
          this.user = this.auth.getUserData();
        }
        else {
          this.user = null;
        }
      }
    );
  }

  onLogout() {
    this.auth.logout();
    this.auth.authSuccess(false);
    this.router.navigate(['/signin']);
  }

}
