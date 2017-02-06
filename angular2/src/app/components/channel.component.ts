import { Component, OnInit } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html'
})
export class ChannelComponent implements OnInit {

  ngOnInit(): void {
    this.useJwtHelper();
  }

  jwtHelper: JwtHelper = new JwtHelper();

  useJwtHelper() {
    var token = localStorage.getItem('id_token');

    console.log(
      this.jwtHelper.decodeToken(token),
      this.jwtHelper.getTokenExpirationDate(token),
      this.jwtHelper.isTokenExpired(token)
    );
  }

}
