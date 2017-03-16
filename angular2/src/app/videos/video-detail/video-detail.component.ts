import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription, Observable} from "rxjs";

import {Video} from "../../shared/models/video";
import {VideoService} from "../video.service";
import {CommentService} from "../video-comments/comment.service";
import {ListResult} from "../../shared/interface/list-result.interface";

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
})
export class VideoDetailComponent implements OnInit, OnDestroy {

  public loading: boolean = false;
  public video: Video;
  public subscription: Subscription;
  public lasts: ListResult<Video>;
  public comments: ListResult<Comment>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private videoService: VideoService,
              private commentService: CommentService) {
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('id')) {
          this.loading = true;
          this.videoService.get(params['id']).subscribe(
            (videoResponse: any) => {
              this.video = videoResponse;
              this.loading = false;
              this.loadLastsAndComments();
            },
            errorResponse => {
              // invalid id
              console.log(errorResponse);
              this.loading = false;
              this.router.navigate(['']);
            }
          );
        }
      }
    );
  }

  private loadLastsAndComments() {
    this.lasts = null;
    this.comments = null;
    Observable.forkJoin([
      this.videoService.query([{'perpage': 5}, {'offset': this.video.id}]),
      this.commentService.query([{'perpage': 2}], [], null, this.video.id)
    ]).subscribe(
      ([lasts, comments]) => {
        this.lasts = lasts;
        this.comments = comments;
      },
      errorResponse => {
        console.log(errorResponse);
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
