import {Component, OnInit, Input} from '@angular/core';
import {UserService} from "../../../shared/services/user.service";
import {User} from "../../../shared/models/user";
import {CommentService} from "../comment.service";
import {Comment} from "../../../shared/models/comment";
import {ListResult} from "../../../shared/interface/list-result.interface";
import {Video} from "../../../shared/models/video";

declare let $: any;

@Component({
  selector: 'app-video-comments-item-media',
  templateUrl: './video-comments-item-media.component.html'
})
export class VideoCommentsItemMediaComponent implements OnInit {

  @Input() comment: Comment;
  @Input() video: Video;
  public user: User;
  public loading: boolean = false;
  public loadingNext: boolean = false;
  public commentToReply: Comment = null;

  constructor(private commentService: CommentService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userService.currentUser.subscribe(
      userData => this.user = userData
    );
    if (this.comment.commentParent) {
      this.commentToReply = this.comment.commentParent;
    }
    else {
      this.commentToReply = this.comment;
    }
  }

  next() {
    this.loadingNext = true;
    this.commentService.query(
      [{'perpage': this.comment.commentChildren.total, 'page': '1'}],
      this.comment.commentChildren._links['next']
    )
      .subscribe(
        (commentResponse: ListResult<Comment>) => {
          this.comment.commentChildren.items = commentResponse.items;
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

  showCommentForm(id: number) {
    $('div#comments-list ul.media-list li.media')
      .find('p').removeClass('comment-simplebox-content')
      .find('textarea').val('');
    $('#formCommentAddShow-' + id).addClass('comment-simplebox-content');
  }
}
