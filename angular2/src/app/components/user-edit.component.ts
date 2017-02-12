import {Component, OnInit} from '@angular/core';
import {User} from "../models/user";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html'
})
export class UserEditComponent implements OnInit {

  public user: User;

  constructor(private auth: AuthService) {
  }

  ngOnInit() {
    this.user = this.auth.getUserData();
  }

}
