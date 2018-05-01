import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';

import { Observable } from 'rxjs/Observable';

import { OrderListType } from '../../models/order-list-type';
import { PastOrderService } from '../../../../core/services/pastOrder.service';
import { FlaggedInvoicesListService } from '../services/flagged-invoices-list.service';
import { Invoice } from '../../models/invoice';

@Component({
  selector: 'app-flagged-invoices-list',
  templateUrl: './flagged-invoices-list.component.html',
  styleUrls: ['./flagged-invoices-list.component.scss'],
})
@DestroySubscribers()
export class FlaggedInvoicesListComponent implements OnInit, OnDestroy {
  public subscribers: any = {};

  public listName: string = OrderListType.flagged;
  public tableHeader: any = [
    {name: 'Invoice #', className: 's1', alias: 'invoice_id', filterBy: false, linkToReconcile: true, },
    {name: 'Vendor', className: 's2', alias: 'vendor', filterBy: true, wrap: 2, },
    {name: 'Status', className: 's1', alias: 'status', filterBy: true, showChevron: true, },
    {name: 'Location', className: 's2', alias: 'location_name', filterBy: true, },
    {name: 'Date', className: 's2', alias: 'date', filterBy: true, },
    {name: 'Reconciled by', className: 's2', alias: 'reconciled_by_name', filterBy: true, },
    {name: '# of Items', className: 's1 bold underline-text center-align', alias: 'item_count'},
    {name: 'Total', className: 's1 bold underline-text right-align', alias: 'total'},
    // {name: '', className: 's1', actions: true},
  ];

  public invoices$: Observable<Invoice[]>;

  constructor(
    public pastOrderService: PastOrderService,
    public flaggedInvoicesListService: FlaggedInvoicesListService,
  ) {

  };

  ngOnInit() {
    this.invoices$ = this.flaggedInvoicesListService.collection$;
  };

  addSubscribers() {
    this.subscribers.getAllCollectionSubscription = this.flaggedInvoicesListService.getCollection()
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
