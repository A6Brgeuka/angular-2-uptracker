import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class OrderTableService {
  uniqueField: string;
  
  orders$: Observable<any>;
  setOrders$: Subject<any>;
  
  toggleBatchSelect$: Subject<any>;
  toggleSelect$: Subject<any>;
  batchSelect$: Observable<any>;
  
  constructor(){
    this.toggleBatchSelect$ = new Subject();
    this.toggleSelect$ = new Subject();
    this.setOrders$ = new Subject();
  
    this.orders$ = this.setOrders$
    .filter((orders) => !!orders)
    .map((orders) => {
      return orders.map(order => ({checked: false, ...order}));
    })
    .switchMap((orders) => {
      
      return this.toggleBatchSelect$
      .switchMap(() => {
        return this.batchSelect$.take(1)
      })
      .map((checked) => {
        return orders.map(order => {
          order.checked = checked;
          return order;
        });
      })
      .startWith(orders)
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
          return order.checked
        })
      })
    )
    .scan((acc, newValue) => {
      if (_.isUndefined(newValue)) return !acc;
      return newValue;
    }).publishReplay(1).refCount();
    
    
  }
  
  toggleSelectAll(){
    this.toggleBatchSelect$.next();
  }
  
  toggleSelect(id){
    this.toggleSelect$.next(id);
  }
}