import {Component, OnInit} from '@angular/core';

import {User} from "../shared/models/user";
import {UserService} from "../shared/services/user.service";
import {VideoService} from "../videos/video.service";
import {VideoListConfig} from "../videos/video-list-config.model";
import {Video} from "../shared/models/video";

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  providers: [VideoService]
})
export class HomeComponent implements OnInit {

  public user: User;
  public videosList: {items: Video[], _links: {}};
  public videoListConfig: VideoListConfig = new VideoListConfig();
  public loading: boolean = false;

  constructor(private userService: UserService, private videoService: VideoService) {
  }

  ngOnInit(): void {

    this.userService.currentUser.subscribe(
      (userData) => {
        this.user = userData;
      }
    );

    this.loading = true;
    this.videoListConfig.filters.perpage = 6;

    this.videoService.query(this.videoListConfig).subscribe(
      videoResponse => {
        this.videosList = videoResponse;
        this.loading = false;
      }
    );
  }

  pagination(action: string) {

    this.loading = true;

    this.videoService.query(null, this.videosList._links[(action)]).subscribe(
      videoResponse => {
        this.videosList = videoResponse;
        this.loading = false;
      },
      errorResponse => {
        console.log(errorResponse);
      }
    );
  }

}
