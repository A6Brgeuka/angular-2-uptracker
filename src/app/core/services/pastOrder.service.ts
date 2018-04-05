import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Restangular } from 'ngx-restangular';

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';

@Injectable()
export class PastOrderService {

  // public entities$: ConnectableObservable<{ [id: string]: any }>;

  public sortBy$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public filterBy$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  // public voidOrder$ = new Subject();
  // public voidOrderRequest$: ConnectableObservable<any>;

  // public removeIds$;
  // private addCollectionToEntittesStream$: Subject<Observable<any>> = new Subject();
  public filterQueryParams$: Subject<any> = new Subject();

  constructor(
    public restangular: Restangular,
    public router: Router,
  ) {

    // this.voidOrderRequest$ = this.voidOrder$
    // .switchMap((data) =>
    //   this.restangular.one('pos', 'void').customPOST(data)
    //   .map(res => res.data)
    // ).publish();
    // this.voidOrderRequest$.connect();

    // this.removeIds$ = this.voidOrderRequest$
    // .map((voidedOrders) => voidedOrders.map((order) => order.id));
    //
    // this.addCollectionStreamToEntittesStream(this.voidOrderRequest$);
    //
    // this.entities$ = this.addCollectionToEntittesStream$
    // .mergeAll()
    // .scan((acc, items: any[]) => {
    //   const newEntities = items.reduce((itemEntities, item) => {
    //     const oldEntity = acc[item.id];
    //     const entityToSet = oldEntity ? {...oldEntity, ...item} : item;
    //     return {
    //       ...itemEntities,
    //       [item.id]: entityToSet,
    //     };
    //   }, {});
    //
    //   return {...acc, ...newEntities};
    // }, {})
    // .publishReplay(1);
    // this.entities$.connect();
  }

  reorder(data) {
    return this.restangular.all('reorder').customPOST(data);
  }

  onVoidOrder(data) {
    // this.voidOrder$.next(data);
    // return this.voidOrderRequest$;
    return null;
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

  /**
   * Used to add stream as source for entities
   * @param {Observable<any>} stream$
   */
  // public addCollectionStreamToEntittesStream(stream$: Observable<any>) {
  //   this.addCollectionToEntittesStream$.next(stream$);
  // }

}
