import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Observable } from 'rxjs/Observable';

import { OrderListType } from '../../models/order-list-type';
import { OrderItem } from '../../models/order-item';
import { OpenOrdersListService } from '../services/open-orders-list.service';

@Component({
  selector: 'app-open-orders-list',
  templateUrl: './open-orders-list.component.html',
  styleUrls: ['./open-orders-list.component.scss'],
})
@DestroySubscribers()
export class OpenOrdersListComponent implements OnInit, OnDestroy {
  public subscribers: any = {};

  public listName: string = OrderListType.open;

  public tableHeaderOpen: any = [
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

  public orders$: Observable<OrderItem[]>;

  constructor(
    public openOrdersListService: OpenOrdersListService,
  ) {

  };

  ngOnInit() {
    this.orders$ = this.openOrdersListService.collection$;
  }

  addSubscribers() {
    this.subscribers.getOpenedProductSubscription = this.openOrdersListService.getCollection()
    .subscribe();
  }

  ngOnDestroy() {
    console.log('for unsubscribing');
  }

}
