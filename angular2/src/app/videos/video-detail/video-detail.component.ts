import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

import {Video} from "../../shared/models/video";
import {VideoService} from "../video.service";

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
})
export class VideoDetailComponent implements OnInit, OnDestroy {

  public loading: boolean = false;
  public video: Video;
  public subscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private videoService: VideoService) {
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('id')) {

          this.loading = true;

          this.videoService.get(params['id'])
            .flatMap((video: Video) => {
              return this.videoService.query([{'perpage': 5}, {'offset': video.id}])
                .map((lasts: any) => {
                  video.lasts = lasts;
                  return video;
                });
            }).subscribe(
            (videoResponse: any) => {
              this.video = videoResponse;
              this.loading = false;
              //this.loadComments();
            },
            errorResponse => {
              console.log(errorResponse);
              this.loading = false;
              this.router.navigate(['']);
            }
          );
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
