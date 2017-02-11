import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {

  public user;

  constructor(private auth: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.user = this.auth.getUserData() ? this.auth.getUserData() : {};
  }

  onLogout(){
    this.auth.logout();
    //this.router.navigate(['/signInUser']);
    window.location.href = "/signInUser";
  }

}
