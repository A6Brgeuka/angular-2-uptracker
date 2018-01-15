import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';

@Component({
  selector: 'app-open-orders-list',
  templateUrl: './open-orders-list.component.html',
  styleUrls: ['./open-orders-list.component.scss'],
})
@DestroySubscribers()
export class OpenOrdersListComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  
  public tableHeaderOpen: any = [
    {name: 'Order #', className: 's2', alias: 'po_number' },
    {name: 'Product Name', className: 's2', alias: 'product_name'},
    {name: 'Location', className: 's2', alias: 'location'},
    {name: 'Placed', className: 's2', alias: 'placed'},
    {name: 'Qty', className: 's1', alias: 'qty'},
    {name: 'Pkg Price', className: 's1', alias: 'pkg_price'},
    {name: 'Total', className: 's1', alias: 'total'},
    {name: '', className: 's1', actions: true},
  ];
  
  public orders: any[] = [
    {
      id: '5',
      po_number: 'AMT-0001',
      product_name: 'Some Product Name',
      location: 'Primary Location',
      status: 'Pending',
      placed: '7/5/18',
      backordered: '8/5/18',
      qty: '100',
      pkg_price: '$1.00',
      total: '$100.00',
    },
    {
      id: '6',
      po_number: 'AMT-0002',
      product_name: 'Some Product Name',
      location: 'Primary Location',
      status: 'Pending',
      placed: '7/5/18',
      backordered: '8/5/18',
      qty: '10',
      pkg_price: '$1.00',
      total: '$10.00',
    },
  ];
  
  constructor(
  
  ) {
  
  }
  
  ngOnInit() {
  
  }
  
  addSubscribers() {
  
  }
  
  ngOnDestroy() {
  
  }
  
}
