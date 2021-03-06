import {Injectable} from "@angular/core";
import {URLSearchParams} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

import {ApiService} from "../shared/services/api.service";
import {Video} from "../shared/models/video";
import {ListResult} from "../shared/interface/list-result.interface";

@Injectable()
export class VideoService {

  constructor(private apiService: ApiService) {
  }

  query(params: any[], defaults: any[] = [], url: string = ''): Observable<ListResult<Video>> {

    let urlSearchParams: URLSearchParams = new URLSearchParams();

    params.forEach(function (item: {}) {
      Object.keys(item).forEach(function (key) {
        urlSearchParams.set(key, item[key]);
      })
    });

    defaults.forEach(function (item) {
      Object.keys(item).forEach(function (key) {
        urlSearchParams.set(key, item[key]);
      })
    });

    if (url) {
      let urlQueryParams = url.split('?')[1].split('&');
      urlQueryParams.forEach(function (value) {
        let paramIndex: any = value.split('=')[0];
        let paramValue: any = value.split('=')[1];
        urlSearchParams.append(paramIndex, paramValue);
      });
    }

    if (!urlSearchParams.has('deep')) {
      urlSearchParams.append('deep', '1');
    }

    return this.apiService.get('/videos', urlSearchParams, false)
      .map(response => response);
  }

  get(id: number): Observable <Video> {

    let params: URLSearchParams = new URLSearchParams();

    params.append('deep', '1');

    return this.apiService.get('/videos/' + id, params, false)
      .map(response => response);
  }

  save(video: Video, id = null): Observable < Video > {
    if (id) {
      return this.apiService.put('/videos/' + id, video)
        .map(response => response);
    } else {
      return this.apiService.post('/videos', video)
        .map(response => response);
    }
  }

  destroy(id: number) {
    return this.apiService.delete('/videos/' + id);
  }
}
