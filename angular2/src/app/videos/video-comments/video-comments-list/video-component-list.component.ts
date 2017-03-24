import {Component, OnInit, Input} from '@angular/core';
import {ListResult} from "../../../shared/interface/list-result.interface";
import {CommentService} from "../comment.service";
import {Video} from "../../../shared/models/video";
import {Comment} from "../../../shared/models/comment";
import {Observable} from "rxjs";

@Component({
  selector: 'app-video-component-list',
  templateUrl: './video-component-list.component.html'
})
export class VideoComponentListComponent implements OnInit {

  @Input() video: Video;
  public loading: boolean = false;
  public loadingNext: boolean = false;

  constructor(private commentService: CommentService) {
  }

  ngOnInit() {
    let listComments = this.commentService.query(
      [{
        'perpage': 2,
        'video': this.video.id
      }], [], null);

    listComments.subscribe((commentsResponse: any) => {
      this.video.comments = commentsResponse;
    });

    listComments.flatMap((comments: any) => {
      if (comments && comments.items.length > 0) {
        return Observable.forkJoin(
          comments.items.map((comment: Comment) => {
            return this.commentService.query(
              [{
                'perpage': 2,
                'video': this.video.id,
                'commentParent': comment.id,
              }], [], null)
              .map((commentsChildren: any) => {
                comment.commentChildren = commentsChildren;
                return comment;
              })
          })
        );
      }
      return Observable.of([]);
    })
      .subscribe(
        (commentItemsResponse: any) => {
          this.video.comments.items = commentItemsResponse;
        }
      );
  }

  next() {
    this.loadingNext = true;
    this.commentService.query([], [], this.video.comments._links['next']).subscribe(
      (commentResponse: any) => {
        for (let item of commentResponse.items) {
          this.video.comments.items.push(item);
        }
        this.video.comments._links = commentResponse._links;
        this.loadingNext = false;
      },
      errorResponse => {
        console.log(errorResponse);
      }
    );
  }
}
