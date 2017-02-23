import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {ApiService} from "./api.service";
import {Video} from "../models/video";

@Injectable()
export class VideoService {

  constructor(private apiService: ApiService) {
  }

  /*query(config: ArticleListConfig): Observable<{articles: Article[], articlesCount: number}> {
    // Convert any filters over to Angular's URLSearchParams
    let params: URLSearchParams = new URLSearchParams();

    Object.keys(config.filters)
      .forEach((key) => {
        params.set(key, config.filters[key]);
      });

    return this.apiService
      .get(
        '/articles' + ((config.type === 'feed') ? '/feed' : ''),
        params
      ).map(data => data);
  }*/

  get(id: number): Observable<Video> {
    return this.apiService.get('/videos/' + id)
      .map(response => response);
  }

  save(video: Video): Observable<Video> {
    if (video.id) {
      return this.apiService.put('/videos/' + video.id, video)
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
