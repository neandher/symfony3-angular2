import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {ApiService} from "../shared/services/api.service";
import {Video} from "../shared/models/video";
import {URLSearchParams} from "@angular/http";
import {VideoListConfig} from "./video-list-config.model";
import {ListResult} from "../shared/services/list-result.interface";

@Injectable()
export class VideoService {

  constructor(private apiService: ApiService) {
  }

  query(config: VideoListConfig = null, url: string = null): Observable<ListResult<Video>> {

    let params: URLSearchParams;

    if (!url) {
      params = new URLSearchParams();

      Object.keys(config.filters).forEach((key) => {
        params.set(key, config.filters[key]);
      });
    }
    else if (url) {
      let newUrl = url.split('?');
      params = new URLSearchParams(newUrl[1]);
    }

    params.append('deep', '1');

    return this.apiService.get('/videos', params, false)
      .map(response => response);
  }

  query2(params: any[], defaults: any[] = []): Observable<ListResult<Video>> {

    let newParams: URLSearchParams = new URLSearchParams();

    params.forEach(function (item: {}) {
      Object.keys(item).forEach(function (key) {
        newParams.set(key, item[key]);
      })
    });

    defaults.forEach(function (item) {
      Object.keys(item).forEach(function (key) {
        newParams.set(key, item[key]);
      })
    });

    newParams.append('deep', '1');

    return this.apiService.get('/videos', newParams, false)
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
