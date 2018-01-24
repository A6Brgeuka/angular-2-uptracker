import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { PastOrderService } from '../../../core/services/pastOrder.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-open-orders-list',
  templateUrl: './open-orders-list.component.html',
  styleUrls: ['./open-orders-list.component.scss'],
})
@DestroySubscribers()
export class OpenOrdersListComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  
  public listName: string = 'open';
  public tableHeaderOpen: any = [
    {name: 'Order #', className: 's2', alias: 'po_number', filterBy: true, },
    {name: 'Product Name', className: 's2', alias: 'item_name', filterBy: true, },
    {name: 'Location', className: 's2', alias: 'location', filterBy: true, },
    {name: 'Placed', className: 's2', alias: 'placed_date', filterBy: true, },
    {name: 'Qty', className: 's1', alias: 'quantity'},
    {name: 'Pkg Price', className: 's1', alias: 'package_price'},
    {name: 'Total', className: 's1', alias: 'total'},
    {name: '', className: 's1 show-hover-elem', actions: true},
  ];
  
  public openedOrders$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  
  constructor(
    public pastOrderService: PastOrderService,
  ) {
  
  }
  
  ngOnInit() {
  
  }
  
  addSubscribers() {
    this.subscribers.getOpenedProductSubscription = this.pastOrderService.getOpenedProducts()
    .subscribe(res => {
      this.openedOrders$.next(res);
    });
  }
  
  ngOnDestroy() {
  
  }
  
}
