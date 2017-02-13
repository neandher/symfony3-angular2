import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html'
})
export class DefaultComponent implements OnInit {

  public titulo: string = "Portada";
  public user;

  constructor(private auth: AuthService) {
  }

  ngOnInit(): void {
    this.user = this.auth.getUserData();
  }

}
