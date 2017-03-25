import {Component, OnInit, Input} from '@angular/core';
import {UserService} from "../../../shared/services/user.service";
import {User} from "../../../shared/models/user";
import {CommentService} from "../comment.service";
import {Comment} from "../../../shared/models/comment";
import {Observable} from "rxjs";

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

    if (this.comment.commentChildren) {
      this.commentService.getChildrensFromParents(this.comment.commentChildren).subscribe(
        (commentItemsResponse: any) => {
          this.comment.commentChildren.items = commentItemsResponse;
        }
      );
    }
  }

  next() {

    this.loadingNext = true;

    let listComments = this.commentService.query([], [], this.comment.commentChildren._links['next']);

    listComments.subscribe(
      (commentResponse: any) => {
        for (let item of commentResponse.items) {
          this.comment.commentChildren.items.push(item);
        }
        this.comment.commentChildren._links = commentResponse._links;
        this.loadingNext = false;
      }
    );

    listComments.flatMap((comments: any) => {
      if (comments && comments.items.length > 0) {
        return this.commentService.getChildrensFromParents(comments);
      }
      return Observable.of([]);
    })
      .subscribe(
        (commentItemsResponse: any) => {
          if (commentItemsResponse.items) {
            this.comment.commentChildren.items.push(commentItemsResponse);
          }
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

  getCommentsChildren() {

  }

}
