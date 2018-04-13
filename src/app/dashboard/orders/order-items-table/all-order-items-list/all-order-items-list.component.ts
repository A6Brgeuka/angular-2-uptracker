import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';

import { Observable } from 'rxjs/Observable';

import { OrderListType } from '../../models/order-list-type';
import { OrderItem } from '../../models/order-item';
import { PastOrderService } from '../../../../core/services/pastOrder.service';
import { AllItemsListService } from '../services/all-items-list.service';
import { FavoritedItemsListService } from '../services/favorited-items-list.service';
import { FlaggedItemsListService } from '../services/flagged-items-list.service';

@Component({
  selector: 'app-all-order-items-list',
  templateUrl: './all-order-items-list.component.html',
  styleUrls: ['./all-order-items-list.component.scss'],
})
@DestroySubscribers()
export class AllItemsListComponent implements OnInit, OnDestroy {
  public subscribers: any = {};

  public listName: string = OrderListType.all;

  public tableHeader: any = [
    {name: 'Order #', className: 's1', alias: 'po_number', filterBy: true, },
    {name: 'Product Name', className: 's2', alias: 'item_name', filterBy: true, wrap: 2, },
    {name: 'Status', className: 's1', alias: 'status', filterBy: true, showChevron: true, },
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
    public allItemsListService: AllItemsListService,
    private favoritedItemsListService: FavoritedItemsListService,
    private flaggedItemsListService: FlaggedItemsListService,
  ) {

  };

  ngOnInit() {
    this.orders$ = this.allItemsListService.collection$;
  };

  addSubscribers() {
    this.subscribers.getAllCollectionSubscription = this.allItemsListService.getCollection()
    .subscribe();
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

}
