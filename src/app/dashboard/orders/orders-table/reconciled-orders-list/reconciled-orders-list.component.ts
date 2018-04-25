import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { OrderListType } from '../../models/order-list-type';
import { OrderStatusAlreadyValues } from '../../models/order-status';
import { ReconciledOrdersListService } from '../services/reconciled-orders-list.service';
import { Order } from '../../models/order';
import { OrdersTableService } from '../services/orders-table.service';
import { FavoritedOrdersListService } from '../services/favorited-orders-list.service';
import { FlaggedOrdersListService } from '../services/flagged-orders-list.service';

@Component({
  selector: 'app-reconciled-orders-list',
  templateUrl: './reconciled-orders-list.component.html',
  styleUrls: ['./reconciled-orders-list.component.scss']
})
@DestroySubscribers()
export class ReconciledOrdersListComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  public listName: string = OrderListType.reconciled;
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
    {name: '', className: 's1', actions: true},
  ];

  public sortBy$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public orders$: Observable<Order[]>;

  constructor(
    public reconciledOrdersListService: ReconciledOrdersListService,
    public ordersTableService: OrdersTableService,
    public favoritedOrdersListService: FavoritedOrdersListService,
    public flaggedOrdersListService: FlaggedOrdersListService,
  ) {

  }

  ngOnInit() {
    this.orders$ = this.reconciledOrdersListService.collection$
    .map((orders) => orders.map((order) => ({...order, status: OrderStatusAlreadyValues.receive})));
  }

  addSubscribers() {
    this.subscribers.getReceivedProductSubscription = this.reconciledOrdersListService.getCollection()
    .subscribe();
  }

  ngOnDestroy() {
    console.log('for unsubscribing');
  }

  sortByHeaderUpdated(event) {
    this.sortBy$.next(event.alias);
  }

  onFavorite(item) {
    this.favoritedOrdersListService.postItem(item);
  }

  onFlagged(item) {
    this.flaggedOrdersListService.putItem(item);
  }

  onVoid(value) {
    const data = {orders: value.map((item) => ({order_id: item.item.order_id, message: item.message}))};
    this.ordersTableService.onVoidOrder(data);
  }

}
