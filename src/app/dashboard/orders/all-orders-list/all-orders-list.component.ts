import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { PastOrderService } from '../../../core/services/pastOrder.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-all-orders-list',
  templateUrl: './all-orders-list.component.html',
  styleUrls: ['./all-orders-list.component.scss'],
})
@DestroySubscribers()
export class AllOrdersListComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  
  public listName: string = 'all';
  public tableHeader: any = [
    {name: 'Order #', className: 's1', alias: 'po_number' },
    {name: 'Product Name', className: 's2', alias: 'item_name'},
    {name: 'Location', className: 's1', alias: 'location'},
    {name: 'Status', className: 's1', alias: 'status'},
    {name: 'Placed', className: 's1', alias: 'placed_date'},
    {name: 'Received', className: 's1', alias: 'received_date'},
    {name: 'Reconciled', className: 's1', alias: 'reconciled_date'},
    {name: 'Qty', className: 's1', alias: 'quantity'},
    {name: 'Pkg Price', className: 's1', alias: 'package_price'},
    {name: 'Total', className: 's1', alias: 'total'},
    {name: '', className: 's1 show-hover-elem', actions: true},
  ];
  
  public orders$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public sortBy$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  
  constructor(
    public pastOrderService: PastOrderService,
  ) {
  
  };
  
  ngOnInit() {
  
  };
  
  addSubscribers() {
    this.subscribers.getCollectionSubscription = this.pastOrderService.getPastOrders()
    .subscribe(orders => {
      //this.pastOrderService.total$.next(orders.length);
      this.orders$.next(orders);
    });
  };
  
  ngOnDestroy() {
  
  };
  
  sortByHeaderUpdated(event) {
    this.sortBy$.next(event.alias);
  }
  
}
