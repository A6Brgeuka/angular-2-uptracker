import { Component } from '@angular/core';

import { map } from 'lodash';

import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-order-items-table',
  templateUrl: './order-items-table.component.html',
  styleUrls: ['./order-items-table.component.scss']
})
export class OrderItemsTableComponent  {
  public subscribers: any = {};

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
    private ordersService: OrdersService,
  ) {
  }

  activeChange(active: boolean, tab: string) {
    this.ordersService.activeChange$.next({active, tab});
  }

}
