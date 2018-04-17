import { Component } from '@angular/core';

import { map } from 'lodash';

import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-invoices-table',
  templateUrl: './invoices-table.component.html',
  styleUrls: ['./invoices-table.component.scss']
})
export class InvoicesTableComponent {
  public subscribers: any = {};

  public invoicesTabs = {
    all: 'all',
    open: 'open',
    approval: 'pending_approval',
    payment: 'pending_payment',
    paid: 'paid',
    flagged: 'flagged',
  };

  public invoicesTabsArr = map(this.invoicesTabs, (value, key) => value);

  constructor(
    private ordersService: OrdersService,
  ) {
  }

  activeChange(active: boolean, tab: string) {
    this.ordersService.activeChange$.next({active, tab});
  }

}
