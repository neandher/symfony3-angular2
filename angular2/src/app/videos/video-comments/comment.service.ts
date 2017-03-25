import {Injectable} from "@angular/core";
import {URLSearchParams} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

import {ApiService} from "../../shared/services/api.service";
import {Comment} from "../../shared/models/comment";
import {ListResult} from "../../shared/interface/list-result.interface";

@Injectable()
export class CommentService {

  constructor(private apiService: ApiService) {
  }

  query(params: any[],
        defaults: any[] = [],
        url: string = ''): Observable<ListResult<Comment>> {

    let urlSearchParams: URLSearchParams = new URLSearchParams();

    params.forEach(function (item: {}) {
      Object.keys(item).forEach(function (key) {
        urlSearchParams.set(encodeURIComponent(key), encodeURIComponent(item[key]));
      })
    });

    defaults.forEach(function (item) {
      Object.keys(item).forEach(function (key) {
        urlSearchParams.set(key, encodeURIComponent(item[key]));
      })
    });

    if (url) {
      let urlQueryParams = url.split('?')[1].split('&');
      urlQueryParams.forEach(function (value) {
        let paramIndex: any = value.split('=')[0];
        let paramValue: any = value.split('=')[1];
        urlSearchParams.append(paramIndex, encodeURIComponent(paramValue));
      });
    }

    if (!urlSearchParams.has('deep')) {
      urlSearchParams.append('deep', '1');
    }

    return this.apiService.get('/comments', urlSearchParams, false)
      .map(response => response);
  }

  get(id: number): Observable <Comment> {

    let params: URLSearchParams = new URLSearchParams();

    params.append('deep', '1');

    return this.apiService.get('/comments/' + id, params, false)
      .map(response => response);
  }

  save(comment: Comment, id = null, videoId = null): Observable <Comment> {
    if (id) {
      return this.apiService.put('/comments/' + id, comment)
        .map(response => response);
    } else {
      return this.apiService.post('/comments/' + videoId + '/video?deep=1', comment)
        .map(response => response);
    }
  }

  destroy(id: number) {
    return this.apiService.delete('/comments/' + id);
  }

  getChildrensFromParents(comments: ListResult<Comment>): Observable<any>{
    return Observable.forkJoin(
      comments.items.map((comment: Comment) => {
        return this.query(
          [{
            'perpage': 2,
            'video': comment.video.id,
            'commentParent': comment.id,
          }], [], null)
          .map((commentsChildren: any) => {
            comment.commentChildren = commentsChildren;
            return comment;
          })
      })
    );
  }

  getChildrensFromParentsOther(comments: Comment[]): Observable<any>{
    return Observable.forkJoin(
      comments.map((comment: Comment) => {
        return this.query(
          [{
            'perpage': 2,
            'video': comment.video.id,
            'commentParent': comment.id,
          }], [], null)
          .map((commentsChildren: any) => {
            comment.commentChildren = commentsChildren;
            return comment;
          })
      })
    );
  }
}
