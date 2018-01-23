import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { OrderTableResetService } from './order-table-reset.service';


@Injectable()
export class OrderTableService {
  uniqueField: string;
  
  orders$: Observable<any>;
  setOrders$: Subject<any>;
  
  toggleBatchSelect$: Subject<any>;
  toggleSelect$: Subject<any>;
  batchSelect$: Observable<any>;
  
  private filterBy$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  filterByObject$: Observable<any>;
  
  constructor(
    private orderTableResetService: OrderTableResetService,
  ) {
    this.toggleBatchSelect$ = new Subject();
    this.toggleSelect$ = new Subject();
    this.setOrders$ = new Subject();
    this.filterByObject$ = this.filterBy$
    .do(res => console.log(res))
    .scan((acc, value) => {
      return value ? {...acc, ...value} : {};
    });
  
    this.orders$ = Observable.combineLatest(
      this.setOrders$
      .filter((orders) => !!orders)
      .map((orders) => {
        return orders.map(order => ({checked: false, ...order}));
      })
      .switchMap((orders) => {
      
        return this.toggleBatchSelect$
        .switchMap(() => {
          return this.batchSelect$.take(1);
        })
        .map((checked) => {
          return orders.map(order => {
            order.checked = checked;
            return order;
          });
        })
        .startWith(orders);
      }),
      this.filterByObject$,
    )
    .map(([orders, filter]: [any, any]) => {
      if (filter) {
        return _.filter(orders, filter);
      }
      return orders;
    })
    .shareReplay(1);
    
  
    this.batchSelect$ = Observable.of(null).merge(
      this.toggleBatchSelect$,
      this.toggleSelect$.withLatestFrom(this.orders$)
      .map(([id, orders]) => {
        return orders
        .map(order => {
          order.checked = order[this.uniqueField] === id ? !order.checked : order.checked;
          return order;
        })
        .every((order) => {
          return order.checked;
        });
      })
    )
    .scan((acc, newValue) => {
      if (_.isUndefined(newValue)) {return !acc; }
      return newValue;
    }).publishReplay(1).refCount();
   
    this.orderTableResetService.resetFilters$
    .subscribe(res => this.filterBy$.next(null));
    
  }
  
  toggleSelectAll() {
    this.toggleBatchSelect$.next();
  }
  
  toggleSelect(id) {
    this.toggleSelect$.next(id);
  }
  
  onFilterByAlias(value, headerCol) {
    this.filterBy$.next({[headerCol.alias]: value });
  }
  
  //resetFilters() {
  //  console.log('reset', 333333);
  //  this.filterBy$.next(null);
  //}
  
}
