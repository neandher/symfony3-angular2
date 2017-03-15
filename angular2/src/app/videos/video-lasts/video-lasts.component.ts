import {Component, OnInit, Input} from '@angular/core';
import {Video} from "../../shared/models/video";
import {VideoService} from "../video.service";

@Component({
  selector: 'app-video-lasts',
  templateUrl: './video-lasts.component.html',
})
export class VideoLastsComponent implements OnInit {

  public videos: {items: Video[],_links: {}};
  public loading: boolean = false;
  public nextClicked: number;
  public maxClicks: number = 2;
  @Input() offset: number = 0;

  constructor(private videoService: VideoService) {
  }

  ngOnInit() {
    if (this.offset > 0) {
      this.loading = true;
      this.videos = null;
      this.nextClicked = 0;

      let params: any[] = [{'offset': this.offset}, {'perpage': 5}];
      this.videoService.query(params).subscribe(
        videoResponse => {
          this.videos = videoResponse;
          this.loading = false;
        },
        errorResponse => {
          console.log(errorResponse);
        }
      );
    }
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
