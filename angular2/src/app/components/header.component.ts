import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {UserDataService} from "../services/user-data.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {

  public user;

  constructor(private auth: AuthService, private _userDataService: UserDataService, private router: Router) {
  }

  ngOnInit(): void {
    this.user = this._userDataService.getUserData();
  }

  onLogout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
