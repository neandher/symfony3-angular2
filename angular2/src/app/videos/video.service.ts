import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {ApiService} from "../shared/services/api.service";
import {Video} from "../shared/models/video";
import {URLSearchParams} from "@angular/http";
import {VideoListConfig} from "./video-list-config.model";

@Injectable()
export class VideoService {

  constructor(private apiService: ApiService) {
  }

  query(config: VideoListConfig): Observable<any[]> {

    let params: URLSearchParams = new URLSearchParams();

    params.append('deep', '1');

    Object.keys(config.filters).forEach((key) => {
      params.set(key, config.filters[key]);
    });

    return this.apiService.get('/videos', params)
      .map(response => response);
  }

  get(id: number): Observable<Video> {

    let params: URLSearchParams = new URLSearchParams();

    params.append('deep', '1');

    return this.apiService.get('/videos/' + id, params)
      .map(response => response);
  }

  save(video: Video, id = null): Observable<Video> {
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
