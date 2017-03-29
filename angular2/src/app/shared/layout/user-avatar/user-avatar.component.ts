import {Component, OnInit, Input} from '@angular/core';
import {User} from "../../models/user";

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html'
})
export class UserAvatarComponent implements OnInit {

  @Input() user: User;

  constructor() {
  }

  ngOnInit() {
  }

}
