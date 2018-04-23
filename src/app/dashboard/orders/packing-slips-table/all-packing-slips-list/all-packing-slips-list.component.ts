import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';

import { Observable } from 'rxjs/Observable';

import { OrderListType } from '../../models/order-list-type';
import { PastOrderService } from '../../../../core/services/pastOrder.service';
import { AllPackingSlipsListService } from '../services/all-packing-slips-list.service';
import { PackingSlip } from '../../models/packing-slip';

@Component({
  selector: 'app-all-packing-slips-list',
  templateUrl: './all-packing-slips-list.component.html',
  styleUrls: ['./all-packing-slips-list.component.scss'],
})
@DestroySubscribers()
export class AllPackingSlipsListComponent implements OnInit, OnDestroy {
  public subscribers: any = {};

  public listName: string = OrderListType.all;
  public tableHeader: any = [
    {name: 'Packing Slip #', className: 's2', alias: 'packing_slip_number', filterBy: true, },
    {name: 'Vendor', className: 's2', alias: 'vendor_name', filterBy: true, wrap: 2, },
    {name: 'Status', className: 's1', alias: 'status', filterBy: true, showChevron: true, },
    {name: 'Location', className: 's2', alias: 'location_name', filterBy: true, },
    {name: 'Date', className: 's1', alias: 'date', filterBy: true, },
    {name: 'Received By', className: 's2', alias: 'received_by', filterBy: true, },
    {name: '# of Items', className: 's1 bold underline-text center-align', alias: 'item_count'},
    {name: '', className: 's1', actions: true},
  ];

  public packingSlips$: Observable<PackingSlip[]>;

  constructor(
    public pastOrderService: PastOrderService,
    public allPackingSlipsListService: AllPackingSlipsListService,
  ) {

  };

  ngOnInit() {
    this.packingSlips$ = this.allPackingSlipsListService.collection$;
  };

  addSubscribers() {
    this.subscribers.getAllCollectionSubscription = this.allPackingSlipsListService.getCollection()
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
