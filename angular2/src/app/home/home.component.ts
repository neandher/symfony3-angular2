import {Component, OnInit, OnDestroy} from '@angular/core';

import {User} from "../shared/models/user";
import {UserService} from "../shared/services/user.service";
import {VideoService} from "../videos/video.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {PagerService} from "../shared/services/pager.service";
import {ListResult} from "../shared/services/list-result.interface";
import {Video} from "../shared/models/video";

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
  private queryExclusion: string[] = ['deep', 'perpage'];
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

        let finalParams: any[] = [];

        Object.keys(params).forEach(function (key) {
          finalParams.push({[key]: params[key]});
        });

        if (!(Object.keys(params).some(function (item) {
            return item == 'page';
          }))) {
          finalParams.push({'page': 1})
        }

        this.queryParams = finalParams;
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
        this.pager = this.pagerService.getPager(this.videosList.total, this.getParam('page'), this.perpage);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  paginationQueryParams(action: string = null, page: number = null) {

    action = action == null ? 'first' : action;

    let urlQueryParams: string[] = (this.videosList._links[(action)].split('?')[1]).split('&');
    let objectParams: string = '{ ';
    let queryExclusion: string[] = this.queryExclusion;

    urlQueryParams.forEach(function (value) {
      let param: string = value.split('=')[0];
      let paramValue: any = value.split('=')[1];

      if (!(queryExclusion.some(function (item) {
          return item == param;
        }))) {

        if (page != null && param == 'page') {
          paramValue = page;
        }
        objectParams += '"' + param + '"' + ' : ' + '"' + paramValue + '"' + ', ';
      }
    });

    objectParams = objectParams.substr(0, (objectParams.length - 2)) + ' }';

    return JSON.parse(objectParams);
  }

  getParam(param: string) {

    let data: any = null;

    this.queryParams.forEach(function (item: {}) {
      Object.keys(item).forEach(function (key) {
        if (key == param) {
          data = item[key];
        }
      })
    });

    return data;
  }
}
