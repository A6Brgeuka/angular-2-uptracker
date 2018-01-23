import { Component, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { PastOrderService } from '../../../core/services/pastOrder.service';

import * as _ from 'lodash';
import { ToasterService } from '../../../core/services/toaster.service';
import { Observable } from 'rxjs/Observable';
import { ReceivedOrderListService } from '../../../core/services/received-order-list.service';

@Component({
  selector: 'app-received-list',
  templateUrl: './received-list.component.html',
  styleUrls: ['./received-list.component.scss']
})
@DestroySubscribers()
export class ReceivedListComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  public listName: string = 'received';
  public tableHeaderReceived: any = [
    {name: 'Order #', className: 's2', alias: 'po_number', filterBy: true, },
    {name: 'Product Name', className: 's2', alias: 'item_name', filterBy: true, },
    {name: 'Location', className: 's2', alias: 'location_name', filterBy: true, },
    {name: 'Placed', className: 's1', alias: 'placed_date', filterBy: true, },
    {name: 'Received', className: 's1', alias: 'received_date', filterBy: true, },
    {name: 'Qty', className: 's1', alias: 'qty'},
    {name: 'Pkg Price', className: 's1', alias: 'package_price'},
    {name: 'Total', className: 's1', alias: 'total'},
    {name: '', className: 's1 show-hover-elem', actions: true},
  ];
  
  public receivedOrders$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public sortBy$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public orders$: Observable<any> = new Observable<any>();
  
  constructor(
    public pastOrderService: PastOrderService,
    public receivedOrderListService: ReceivedOrderListService,
    public toasterService: ToasterService,
  ) {

  }
  
  ngOnInit() {
    
    this.orders$ = this.receivedOrders$
    .map((orders) => {
      return _.uniqBy(orders, 'item_id');
    });
    
  }
  
  addSubscribers() {
    
    this.subscribers.getReceivedProductSubscription = this.receivedOrderListService.getReceivedProducts()
    .subscribe(res => {
        this.receivedOrders$.next(res);
    });
    
  }
  
  ngOnDestroy() {
    console.log('for unsubscribing');
  }
  
  sortByHeaderUpdated(event) {
    this.sortBy$.next(event.alias);
  }
  
}
