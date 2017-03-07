import {Injectable} from "@angular/core";
import {Params} from "@angular/router";

import {ListResult} from "../interface/list-result.interface";

var _ = require('underscore');

@Injectable()
export class PagerService {

  public queryParams: any[];
  public queryExclusion: string[] = ['deep', 'perpage'];

  getPager(totalItems: number, pageSize: number = 10): {} {

    let currentPage: number = this.getParam('page');
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);

    let startPage: number, endPage: number;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = _.range(startPage, endPage + 1);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

  handleQueryParams(params: Params): any[] {

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

    return this.queryParams;
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

  buildRouterQueryParams(list: ListResult<any>, queryExclusion: string[] = null, action: string = null, page: number = null): {} {

    action = action == null ? 'first' : action;

    let urlQueryParams: string[] = (list._links[(action)].split('?')[1]).split('&');
    let objectParamsStr: string = '{ ';

    queryExclusion = queryExclusion != null ? queryExclusion.concat(['deep']) : this.queryExclusion;

    urlQueryParams.forEach(function (value) {
      let valueSplit = value.split('=');
      let param: string = valueSplit[0];
      let paramValue: any = valueSplit[1];

      if (!(queryExclusion.some(function (item) {
          return item == param;
        }))) {

        if (page != null && param == 'page') {
          paramValue = page;
        }

        objectParamsStr += '"' + param + '"' + ' : ' + '"' + paramValue + '"' + ', ';
      }
    });

    objectParamsStr = objectParamsStr.substr(0, (objectParamsStr.length - 2)) + ' }';

    return JSON.parse(objectParamsStr);
  }
}
