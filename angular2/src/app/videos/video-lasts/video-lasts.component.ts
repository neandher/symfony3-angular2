import {Component, OnInit, Input} from '@angular/core';

import {Video} from "../../shared/models/video";
import {VideoService} from "../video.service";
import {ListResult} from "../../shared/interface/list-result.interface";

@Component({
  selector: 'app-video-lasts',
  templateUrl: './video-lasts.component.html',
})
export class VideoLastsComponent implements OnInit {

  @Input() videos: ListResult<Video>;
  public loading: boolean = false;
  public nextClicked: number = 0;
  public maxClicks: number = 2;

  constructor(private videoService: VideoService) {
  }

  ngOnInit() {
  }

  next() {
    if (this.nextClicked < this.maxClicks) {
      this.loading = true;
      this.videoService.query([], [], this.videos._links['next']).subscribe(
        videoResponse => {
          for (let item of videoResponse.items) {
            this.videos.items.push(item);
          }
          this.videos._links = videoResponse._links;
          this.loading = false;
        },
        errorResponse => {
          console.log(errorResponse);
        }
      );
    }
    this.nextClicked++;
  }

}
