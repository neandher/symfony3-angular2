import {Component, OnInit, Input} from '@angular/core';
import {ListResult} from "../interface/list-result.interface";
import {PagerService} from "./pager.service";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
})
export class PaginationComponent implements OnInit {

  @Input() itemList: ListResult<any>;
  @Input() pager: {};
  @Input() routerName: string;

  constructor(private pagerService: PagerService) {
  }

  ngOnInit() {
  }

  routerQueryParams(action: string = null, page: number = null): {} {
    return this.pagerService.buildRouterQueryParams(this.itemList, null, action, page);
  }
}
