import {Component, OnInit, Input} from '@angular/core';
import {ListResult} from "../../../shared/interface/list-result.interface";
import {CommentService} from "../comment.service";
import {Video} from "../../../shared/models/video";
import {Comment} from "../../../shared/models/comment";
import {Observable} from "rxjs";

@Component({
  selector: 'app-video-comments-list',
  templateUrl: 'video-comments-list.component.html'
})
export class VideoCommentsListComponent implements OnInit {

  @Input() video: Video;
  public loading: boolean = false;
  public loadingNext: boolean = false;

  constructor(private commentService: CommentService) {
  }

  ngOnInit() {
    let listComments = this.commentService.query([{'video': this.video.id}]);
    this.handleComments(listComments)
      .subscribe(commentsResponse => {
        this.video.comments = commentsResponse;
      });
  }

  next() {
    this.loadingNext = true;
    let listComments = this.commentService.query(
      [],
      this.video.comments._links['next']
    );
    this.handleComments(listComments)
      .subscribe(commentsResponse => {
        for (let item of commentsResponse.items) {
          this.video.comments.items.push(item);
        }
        this.video.comments._links = commentsResponse._links;
        this.loadingNext = false;
      });
  }

  private handleComments(listComments: Observable<ListResult<Comment>>) {
    let listCommentsItems = listComments
      .map(response => response.items)
      .flatMap((comments: any) => {
        return this.commentService.getChildrensFromParents(comments);
      });

    return Observable.forkJoin([listComments, listCommentsItems])
      .map(data => {
        let fullResponse: any = data[0];
        fullResponse.items = data[1];
        return fullResponse;
      })
  }
}
