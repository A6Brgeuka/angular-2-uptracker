import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';

import { Observable } from 'rxjs/Observable';

import { OrderListType } from '../../models/order-list-type';
import { OrderItem } from '../../models/order-item';
import { PastOrderService } from '../../../../core/services/pastOrder.service';
import { ClosedOrdersListService } from '../services/closed-orders-list.service';

@Component({
  selector: 'app-closed-orders-list',
  templateUrl: './closed-orders-list.component.html',
  styleUrls: ['./closed-orders-list.component.scss']
})
@DestroySubscribers()
export class ClosedOrdersListComponent implements OnInit, OnDestroy {
  public subscribers: any = {};

  public listName: string = OrderListType.closed;
  public tableHeader: any = [
    {name: 'Order #', className: 's1', alias: 'order_number', filterBy: true, },
    {name: 'Vendor', className: 's2', alias: 'vendor_name', filterBy: true, wrap: 2, },
    {name: 'Status', className: 's1', alias: 'status', filterBy: true, showChevron: true, },
    {name: 'Location', className: 's1', alias: 'location_name', filterBy: true, },
    {name: 'Placed', className: 's1', alias: 'placed_date', filterBy: true, },
    {name: 'Received', className: 's1', alias: 'received_date', filterBy: true, },
    {name: 'Reconciled', className: 's1', alias: 'reconciled_date', filterBy: true, },
    {name: '# of Items', className: 's2 items-numbers', aliasItemArray: 'order_items'},
    {name: 'Total', className: 's1 bold underline-text right-align', alias: 'total'},
    {name: '', className: 's1', actions: true},
  ];

  public orders$: Observable<OrderItem[]>;

  constructor(
    public closedOrdersListService: ClosedOrdersListService,
    public pastOrderService: PastOrderService,
  ) {

  };

  ngOnInit() {
    this.orders$ = this.closedOrdersListService.collection$;
  };

  addSubscribers() {
    // this.subscribers.getClosedCollectionSubscription = this.closedOrdersListService.getCollection()
    // .subscribe();
  };

  ngOnDestroy() {
    console.log('for unsubscribing');
  };

  sortByHeaderUpdated(event) {
    this.pastOrderService.updateSortBy(event.alias);
  }

  onFilterBy(value) {
    this.pastOrderService.updateFilterBy(value);
  }

}
