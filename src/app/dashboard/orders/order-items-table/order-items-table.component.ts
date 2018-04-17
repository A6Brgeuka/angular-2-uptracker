import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Modal } from 'angular2-modal';

import { map } from 'lodash';

import { PastOrderService } from '../../../core/services/pastOrder.service';
import { ModalWindowService } from '../../../core/services/modal-window.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-order-items-table',
  templateUrl: './order-items-table.component.html',
  styleUrls: ['./order-items-table.component.scss']
})
@DestroySubscribers()
export class OrderItemsTableComponent  {
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
    public modal: Modal,
    public router: Router,
    public pastOrderService: PastOrderService,
    public modalWindowService: ModalWindowService,
    public toasterService: ToasterService,
    private ordersService: OrdersService,
  ) {
  }

  activeChange(active: boolean, tab: string) {
    this.ordersService.activeChange$.next({active, tab});
  }

}
