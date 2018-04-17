import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { OrderListType } from '../../models/order-list-type';
import { OrderItem } from '../../models/order-item';
import { OrderStatusAlreadyValues } from '../../models/order-status';
import { ReceivedOrdersListService } from '../services/received-orders-list.service';

@Component({
  selector: 'app-received-orders-list',
  templateUrl: './received-orders-list.component.html',
  styleUrls: ['./received-orders-list.component.scss']
})
@DestroySubscribers()
export class ReceivedOrdersListComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  public listName: string = OrderListType.received;
  public tableHeaderReceived: any = [
    {name: 'Order #', className: 's1', alias: 'order_number', filterBy: true, },
    {name: 'Vendor', className: 's2', alias: 'vendor_name', filterBy: true, wrap: 2, },
    {name: 'Status', className: 's1', alias: 'status', filterBy: true, showChevron: true, },
    {name: 'Location', className: 's1', alias: 'location_name', filterBy: true, },
    {name: 'Placed', className: 's1', alias: 'placed_date', filterBy: true, },
    {name: 'Received', className: 's1', alias: 'received_date', filterBy: true, },
    {name: 'Reconciled', className: 's1', alias: 'reconciled_date', filterBy: true, },
    {name: '# of Items', className: 's1 bold underline-text center-align', alias: 'item_count'},
    {name: 'Total', className: 's1 bold underline-text right-align', alias: 'total'},
    {name: '', className: 's1', actions: false},
  ];

  public sortBy$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public orders$: Observable<OrderItem[]>;

  constructor(
    public receivedOrdersListService: ReceivedOrdersListService,
  ) {

  }

  ngOnInit() {
    this.orders$ = this.receivedOrdersListService.collection$
    .map((orders) => orders.map((order) => ({...order, status: OrderStatusAlreadyValues.receive})));
  }

  addSubscribers() {
    this.subscribers.getReceivedProductSubscription = this.receivedOrdersListService.getCollection()
    .subscribe();
  }

  ngOnDestroy() {
    console.log('for unsubscribing');
  }

  sortByHeaderUpdated(event) {
    this.sortBy$.next(event.alias);
  }

}
