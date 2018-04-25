import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Restangular } from 'ngx-restangular';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PastOrderService {

  public sortBy$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public filterBy$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(
    public restangular: Restangular,
    public router: Router,
  ) {

  }

  reorder(data) {
    return this.restangular.all('reorder').customPOST(data);
  }

  updateSortBy(param) {
    this.sortBy$.next(param);
  }

  updateFilterBy(value) {
    this.filterBy$.next(value);
  }

  getPastOrder(id: string) {
    //GET /po/{order_id} - the order_id, not po_number
    return this.restangular.one('po', id).customGET()
    .map((res: any) => res.data);
  }

  goToReceive(params, type?) {
    this.router.navigate(['orders/receive', params], {queryParams: {type}});
  }

}
