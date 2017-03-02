import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {Video} from "../../shared/models/video";
import {Subscription} from "rxjs";
import {VideoService} from "../video.service";
import {VideoListConfig} from "../video-list-config.model";

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
})
export class VideoDetailComponent implements OnInit, OnDestroy {

  public loading: boolean = false;
  public video: Video;
  public subscription: Subscription;
  public lastsVideos: Video[];
  public listConfig: VideoListConfig = new VideoListConfig();

  constructor(private route: ActivatedRoute, private router: Router, private videoService: VideoService) {
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('id')) {

          this.loading = true;

          // get the video

          this.videoService.get(params['id']).subscribe(
            (videoResponse: any) => {
              this.video = videoResponse;
              this.loading = false;
              this.lastsVideos = [];

              //lasts videos

              this.listConfig = {
                filters: {
                  offset: this.video.id,
                  maxresults: 15,
                  perpage: 5,
                }
              };

              this.videoService.query(this.listConfig).subscribe(
                (videoResponse: any[]) => {
                  this.lastsVideos = videoResponse;
                  console.log(this.lastsVideos);
                },
                errorResponse => {
                  console.log(errorResponse);
                }
              );

            },
            errorResponse => {
              // invalid id
              console.log(errorResponse);
              this.loading = false;
            }
          );

        }
        else {
          this.router.navigate(['']);
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
