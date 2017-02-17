import {Component, OnInit} from '@angular/core';

import {User} from "../models/user";
import {UserService} from "../shared/services/user.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {

  public user: User;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(
      (userData) => {
        this.user = userData;
      }
    );
  }

}
