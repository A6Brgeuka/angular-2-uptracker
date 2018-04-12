import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { map } from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-packing-slips-table',
  templateUrl: './packing-slips-table.component.html',
  styleUrls: ['./packing-slips-table.component.scss']
})
@DestroySubscribers()
export class PackingSlipsTableComponent implements OnInit, OnDestroy {
  public subscribers: any = {};

  public packingSlips$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public visible: boolean[] = [];
  public packingSlipsTabs = {
    all: 'all',
    open: 'open',
    received: 'received',
  };

  public packingSlipsTabsArr = map(this.packingSlipsTabs, (value, key) => value);

  constructor(
    private ordersService: OrdersService,
  ) {
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    console.log('for unsubscribing');
  }

  activeChange(active: boolean, tab: string) {
    this.ordersService.activeChange$.next({active, tab});
  }

}
