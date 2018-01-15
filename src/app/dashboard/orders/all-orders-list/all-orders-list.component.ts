import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { PastOrderService } from '../../../core/services/pastOrder.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-all-orders-list',
  templateUrl: './all-orders-list.component.html',
  styleUrls: ['./all-orders-list.component.scss'],
})
@DestroySubscribers()
export class AllOrdersListComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  
  public tableHeader: any = [
    {name: 'Order #', className: 's1', alias: 'po_number' },
    {name: 'Product Name', className: 's2', alias: 'item_name'},
    {name: 'Location', className: 's1', alias: 'location'},
    {name: 'Status', className: 's1', alias: 'status'},
    {name: 'Placed', className: 's1', alias: 'placed_date'},
    {name: 'Received', className: 's1', alias: 'received_date'},
    {name: 'Reconciled', className: 's1', alias: 'reconciled_date'},
    {name: 'Qty', className: 's1', alias: 'quantity'},
    {name: 'Pkg Price', className: 's1', alias: 'package_price'},
    {name: 'Total', className: 's1', alias: 'total'},
    {name: '', className: 's1', actions: true},
  ];
  
  public orders$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  
  
  //public orders: any[] = [
  //  {
  //    id: '1',
  //    order_number: 'AMT-0001',
  //    product_name: 'Some Product Name1',
  //    location: 'Primary Location',
  //    status: 'Pending',
  //    placed: '7/5/18',
  //    received: '8/5/18',
  //    reconciled: '9/5/18',
  //    qty: '100',
  //    pkg_price: '$1.00',
  //    total: '$100.00',
  //    flagged: true,
  //    favorite: true,
  //  },
  //  {
  //    id: '2',
  //    order_number: 'AMT-0002',
  //    product_name: 'Some Product Name2',
  //    location: 'Primary Location',
  //    status: 'Pending',
  //    placed: '7/5/18',
  //    received: '8/5/18',
  //    reconciled: '9/5/18',
  //    qty: '10',
  //    pkg_price: '$1.00',
  //    total: '$10.00',
  //    flagged: false,
  //    favorite: false,
  //  },
  //];
  //
  constructor(
    public pastOrderService: PastOrderService,
  ) {
  
  };
  
  ngOnInit() {
  
  };
  
  addSubscribers() {
    this.subscribers.getCollectionSubscription = this.pastOrderService.getPastOrders()
    .subscribe(orders => {
      this.pastOrderService.loadCollection$.next(orders);
      this.pastOrderService.total$.next(orders.length);
      this.orders$.next(orders);
    });
  };
  
  ngOnDestroy() {
  
  };
  
  sendToReceiveOrder(item) {
  
  };
  
  setFlag(event, item) {
  
  };
  
  openResendDialog(item) {
  
  };
  
  buyAgainOrder(item) {
  
  };
  onVoidOrder(item) {
  
  };
  
  setCheckbox(item) {
  
  };
}
