import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {User} from "../models/user";

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html'
})
export class DefaultComponent implements OnInit {

  public titulo: string = "Portada";
  public user: User;

  constructor(private auth: AuthService) {
  }

  ngOnInit(): void {
    this.user = this.auth.getUserData();
  }

}
