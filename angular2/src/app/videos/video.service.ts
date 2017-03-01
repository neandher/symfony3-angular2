import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {ApiService} from "../shared/services/api.service";
import {Video} from "../shared/models/video";
import {URLSearchParams} from "@angular/http";

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

  get(id: number, deep: boolean = false): Observable<Video> {
    return this.apiService.get('/videos/' + id, (new URLSearchParams()), true, deep)
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
