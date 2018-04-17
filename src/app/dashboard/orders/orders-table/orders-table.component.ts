import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { map } from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { PastOrderService } from '../../../core/services/pastOrder.service';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.scss']
})
@DestroySubscribers()
export class OrdersTableComponent implements OnInit, OnDestroy {
  public subscribers: any = {};

  public orders$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public visible: boolean[] = [];
  public orderTabs = {
    all: 'all',
    open: 'open',
    received: 'received',
    backordered: 'backordered',
    reconciled: 'reconciled',
    closed: 'closed',
    flagged: 'flagged',
    favorited: 'favorited',
  };

  public orderTabsArr = map(this.orderTabs, (value, key) => value);

  constructor(
    public router: Router,
    public pastOrderService: PastOrderService,
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
