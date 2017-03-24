import {Component, OnInit, Input} from '@angular/core';
import {CommentService} from "./comment.service";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";

import {ListResult} from "../../shared/interface/list-result.interface";
import {Comment} from "../../shared/models/comment";
import {BaseComponent} from "../../base.component";
import {UserService} from "../../shared/services/user.service";
import {User} from "../../shared/models/user";
import {Video} from "../../shared/models/video";

@Component({
  selector: 'app-video-comments',
  templateUrl: './video-comments.component.html',
})
export class VideoCommentsComponent implements OnInit {

  @Input() video: Video;
  public user: User;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    if (this.video) {
      this.userService.currentUser.subscribe(
        userData => this.user = userData
      );
    }
  }
}
