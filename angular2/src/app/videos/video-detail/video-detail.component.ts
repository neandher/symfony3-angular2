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
  public lastsVideosloading: boolean = false;
  public video: Video;
  public subscription: Subscription;
  public lastsVideos: {items: Video[],_links: {}};
  public listConfig: VideoListConfig = new VideoListConfig();
  public lastsVideosClicked: number;
  public lastsVideosMaxClicks: number = 2;

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
              this.lastsVideos = null;
              this.lastsVideosClicked = 0;

              //lasts videos

              this.listConfig.filters.offset = this.video.id;
              this.listConfig.filters.perpage = 5;

              this.videoService.query(this.listConfig).subscribe(
                videoResponse => {
                  this.lastsVideos = videoResponse;
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

  lastsVideosNext() {

    let hasNext = Object.keys(this.lastsVideos._links).some(function (item) {
      return item == 'next';
    });

    if (hasNext && this.lastsVideosClicked < this.lastsVideosMaxClicks) {
      this.lastsVideosloading = true;

      this.videoService.query(null, this.lastsVideos._links['next']).subscribe(
        videoResponse => {
          for (let item of videoResponse.items) {
            this.lastsVideos.items.push(item);
          }
          this.lastsVideos._links = videoResponse._links;
          this.lastsVideosloading = false;
        },
        errorResponse => {
          console.log(errorResponse);
        }
      );

      this.lastsVideosClicked++;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
