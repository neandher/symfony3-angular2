import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {UserDataService} from "../services/user-data.service";

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html'
})
export class DefaultComponent implements OnInit {

  public titulo: string = "Portada";
  public user;

  constructor(private auth: AuthService, private _userDataService: UserDataService) {
  }

  ngOnInit(): void {
    this.user = this._userDataService.getUserData();
  }

}
