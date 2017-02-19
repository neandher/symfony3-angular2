import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {User} from "../../../models/user";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html'
})

export class HeaderComponent implements OnInit {

  user: User;

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(
      (userData) => {
        this.user = userData;
      }
    );
  }

  onLogout() {
    this.userService.purgeAuth();
    this.router.navigate(['/signin']);
  }

}
