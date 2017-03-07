import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";

import {User} from "../shared/models/user";
import {UserService} from "../shared/services/user.service";
import {VideoService} from "../videos/video.service";
import {PagerService} from "../shared/pagination/pager.service";
import {Video} from "../shared/models/video";
import {ListResult} from "../shared/interface/list-result.interface";

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  providers: [VideoService]
})
export class HomeComponent implements OnInit, OnDestroy {

  public user: User;
  public videosList: ListResult<Video>;
  public loading: boolean = false;
  public queryParams: any[];
  public pager: {};
  private perpage: number = 6;
  private subscription: Subscription;

  constructor(private userService: UserService,
              private videoService: VideoService,
              private route: ActivatedRoute,
              private pagerService: PagerService) {
  }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(
      (userData) => {
        this.user = userData;
      }
    );
    this.subscription = this.route.queryParams.subscribe(
      params => {
        this.queryParams = this.pagerService.handleQueryParams(params);
        this.loadVideos();
      }
    );
  }

  private loadVideos() {
    let defaults: any[] = [{'perpage': this.perpage}];

    this.loading = true;
    this.videoService.query2(this.queryParams, defaults).subscribe(
      videoResponse => {
        this.loading = false;
        this.videosList = videoResponse;
        this.pager = this.pagerService.getPager(this.videosList.total, this.perpage);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
