import { Component, OnDestroy, OnInit } from '@angular/core';

import * as _ from 'lodash';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { PastOrderService } from '../../../core/services/pastOrder.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-flagged-list',
  templateUrl: './flagged-list.component.html',
  styleUrls: ['./flagged-list.component.scss'],
})
@DestroySubscribers()
export class FlaggedListComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  
  public listName: string = 'flagged';
  public tableHeader: any = [
    {name: 'Order #', className: 's1', alias: 'po_number', filterBy: true, },
    {name: 'Product Name', className: 's2', alias: 'item_name', filterBy: true, },
    {name: 'Location', className: 's1', alias: 'location', filterBy: true, },
    {name: 'Status', className: 's1', alias: 'status', filterBy: true, },
    {name: 'Placed', className: 's1', alias: 'placed_date', filterBy: true, },
    {name: 'Received', className: 's1', alias: 'received_date', filterBy: true, },
    {name: 'Reconciled', className: 's1', alias: 'reconciled_date', filterBy: true, },
    {name: 'Qty', className: 's1', alias: 'quantity'},
    {name: 'Pkg Price', className: 's1', alias: 'package_price'},
    {name: 'Total', className: 's1', alias: 'total'},
    {name: '', className: 's1 show-hover-elem', actions: true},
  ];
  
  public orders$: Observable<any> = new Observable<any>();
  
  constructor(
    public pastOrderService: PastOrderService,
  ) {
  
  };
  
  ngOnInit() {
    
    this.orders$ = Observable
    .combineLatest(
      this.pastOrderService.collection$,
      this.pastOrderService.sortBy$,
      //this.pastOrderService.filterBy$,
    )
    .map(([orders, sortBy]) => {
      return _.sortBy(orders, sortBy);
    });
  };
  
  addSubscribers() {
    this.subscribers.getCollectionSubscription = this.pastOrderService.getPastOrders()
    .subscribe(orders => {
      //this.orders$.next(orders);
    });
    
    //this.subscribers.filterBySubscription = this.pastOrderService.filterBy$
    //.switchMap((value: any) => {
    // return this.orders$.map(orders => _.filter(orders, value));
    //})
    //.subscribe();
    
  };
  
  ngOnDestroy() {
  
  };
  
  sortByHeaderUpdated(event) {
    this.pastOrderService.updateSortBy(event.alias);
  }
  
  onFilterBy(value) {
    this.pastOrderService.updateFilterBy(value);
  }
  
}
