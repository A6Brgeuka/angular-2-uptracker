import { Component } from '@angular/core';

import { map } from 'lodash';

import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-packing-slips-table',
  templateUrl: './packing-slips-table.component.html',
  styleUrls: ['./packing-slips-table.component.scss']
})
export class PackingSlipsTableComponent {

  public visible: boolean[] = [];
  public packingSlipsTabs = {
    all: 'all',
  };

  public packingSlipsTabsArr = map(this.packingSlipsTabs, (value, key) => value);

  constructor(
    private ordersService: OrdersService,
  ) {
  }

  activeChange(active: boolean, tab: string) {
    this.ordersService.activeChange$.next({active, tab});
  }

}
