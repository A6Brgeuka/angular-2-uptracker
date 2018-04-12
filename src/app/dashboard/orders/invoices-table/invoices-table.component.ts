import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { map } from 'lodash';

import { OrdersService } from '../orders.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-invoices-table',
  templateUrl: './invoices-table.component.html',
  styleUrls: ['./invoices-table.component.scss']
})
@DestroySubscribers()
export class InvoicesTableComponent {
  public subscribers: any = {};

  public visible: boolean[] = [];
  public invoicesTabs = {
    all: 'all',
    open: 'open',
    approval: 'pending approval',
    payment: 'pending payment',
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
