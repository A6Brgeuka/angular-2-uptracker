import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';

import { Observable } from 'rxjs/Observable';

import { OrderListType } from '../../models/order-list-type';
import { OrderItem } from '../../models/order-item';
import { PastOrderService } from '../../../../core/services/pastOrder.service';
import { AllInvoicesListService } from '../services/all-invoices-list.service';

@Component({
  selector: 'app-all-invoices-list',
  templateUrl: './all-invoices-list.component.html',
  styleUrls: ['./all-invoices-list.component.scss'],
})
@DestroySubscribers()
export class AllInvoicesListComponent implements OnInit, OnDestroy {
  public subscribers: any = {};

  public listName: string = OrderListType.all;
  public tableHeader: any = [
    {name: 'Invoice #', className: 's1', alias: 'invoice_id', filterBy: true, },
    {name: 'Vendor', className: 's2', alias: 'vendor', filterBy: true, wrap: 2, },
    {name: 'Status', className: 's1', alias: 'status', filterBy: true, showChevron: true, },
    {name: 'Location', className: 's2', alias: 'location_name', filterBy: true, },
    {name: 'Date', className: 's2', alias: 'date', filterBy: true, },
    {name: 'Reconciled by', className: 's2', alias: 'reconciled_by_name', filterBy: true, },
    {name: '# of Items', className: 's1 bold underline-text center-align', alias: 'item_count'},
    {name: 'Total', className: 's1 bold underline-text right-align', alias: 'total'},
    // {name: '', className: 's1', actions: true},
  ];

  public invoices$: Observable<OrderItem[]>;

  constructor(
    public pastOrderService: PastOrderService,
    public allInvoicesListService: AllInvoicesListService,
  ) {

  };

  ngOnInit() {
    this.invoices$ = this.allInvoicesListService.collection$;
  };

  addSubscribers() {
    this.subscribers.getAllCollectionSubscription = this.allInvoicesListService.getCollection()
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

}
