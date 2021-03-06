import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Observable } from 'rxjs/Observable';

import { OrderListType } from '../../models/order-list-type';
import { OrderItem } from '../../models/order-item';
import { PastOrderService } from '../../../../core/services/pastOrder.service';
import { FavoritedItemsListService } from '../services/favorited-items-list.service';
import { FlaggedItemsListService } from '../services/flagged-items-list.service';
import { OrderItemsTableService } from '../services/order-items-table.service';

@Component({
  selector: 'app-reconciled-items-list',
  templateUrl: './reconciled-items-list.component.html',
  styleUrls: ['./reconciled-items-list.component.scss'],
})
@DestroySubscribers()
export class ReconciledItemsListComponent implements OnInit, OnDestroy {
  public subscribers: any = {};

  public listName = OrderListType.reconciled;
  public tableHeader: any = [
    {name: 'Order #', className: 's1', alias: 'po_number', filterBy: true, },
    {name: 'Product Name', className: 's2', alias: 'item_name', filterBy: true, wrap: 2, },
    {name: 'Status', className: 's1', alias: 'status', filterBy: false, showChevron: true, },
    {name: 'Location', className: 's1', alias: 'location_name', filterBy: true, },
    {name: 'Placed', className: 's1', alias: 'placed_date', filterBy: true, },
    {name: 'Received', className: 's1', alias: 'received_date', filterBy: true, },
    {name: 'Reconciled', className: 's1', alias: 'reconciled_date', filterBy: true, },
    {name: 'Qty', className: 's1 bold underline-text right-align', alias: 'quantity'},
    {name: 'Pkg Price', className: 's1', alias: 'package_price'},
    {name: 'Total', className: 's1 bold underline-text right-align', alias: 'total'},
    {name: '', className: 's1', actions: true},
  ];


  public orders$: Observable<OrderItem[]>;

  constructor(
    public pastOrderService: PastOrderService,
    private favoritedItemsListService: FavoritedItemsListService,
    private flaggedItemsListService: FlaggedItemsListService,
    private orderItemsTableService: OrderItemsTableService,
  ) {

  };

  ngOnInit() {
    // this.orders$ = this.pastOrderService.favoritedListCollection$;
  };

  addSubscribers() {

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

  onFavorite(item) {
    this.favoritedItemsListService.postItem(item);
  }

  onFlagged(item) {
    this.flaggedItemsListService.putItem(item);
  }

  onVoid(value) {
    const data = {items: value.map((item) => ({id: item.item.id, message: item.message}))};
    this.orderItemsTableService.onVoidOrder(data);
  }

}
