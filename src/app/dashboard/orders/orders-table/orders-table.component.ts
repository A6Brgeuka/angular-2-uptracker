import { Component } from '@angular/core';

import { map } from 'lodash';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.scss']
})
export class OrdersTableComponent {
  public subscribers: any = {};

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
    private ordersService: OrdersService,
  ) {
  }

  activeChange(active: boolean, tab: string) {
    this.ordersService.activeChange$.next({active, tab});
  }

}
