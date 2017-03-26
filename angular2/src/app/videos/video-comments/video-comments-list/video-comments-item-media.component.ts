import {Component, OnInit, Input} from '@angular/core';
import {UserService} from "../../../shared/services/user.service";
import {User} from "../../../shared/models/user";
import {CommentService} from "../comment.service";
import {Comment} from "../../../shared/models/comment";

@Component({
  selector: 'app-video-comments-item-media',
  templateUrl: './video-comments-item-media.component.html'
})
export class VideoCommentsItemMediaComponent implements OnInit {

  @Input() comment: Comment;
  public user: User;
  public loading: boolean = false;
  public loadingNext: boolean = false;

  constructor(private commentService: CommentService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userService.currentUser.subscribe(
      userData => this.user = userData
    );
  }

  next() {
    this.loadingNext = true;
    this.commentService.query(
      [],
      this.comment.commentChildren._links['next']
    )
      .subscribe(
        (commentResponse: any) => {
          for (let item of commentResponse.items) {
            this.comment.commentChildren.items.push(item);
          }
          this.comment.commentChildren._links = commentResponse._links;
          this.loadingNext = false;
        }
      );
  }

  deleteComment(id: number) {
    let commentPanel = <HTMLElement>document.querySelector('.comment-panel-' + id);
    if (commentPanel != null) {
      commentPanel.style.display = 'none';
    }
    this.commentService.destroy(id).subscribe();
  }

}
