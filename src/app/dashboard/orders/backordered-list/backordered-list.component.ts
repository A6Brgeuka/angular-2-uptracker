import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';

@Component({
  selector: 'app-backordered-list',
  templateUrl: './backordered-list.component.html',
  styleUrls: ['./backordered-list.component.scss']
})
@DestroySubscribers()
export class BackorderedListComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  
  public orders: any[] = [
    {
      id: '3',
      order_number: 'AMT-0001',
      product_name: 'Some Product Name',
      location: 'Primary Location',
      status: 'Pending',
      placed: '7/5/18',
      backordered: '8/5/18',
      qty: '100',
      pkg_price: '$1.00',
      total: '$100.00',
      flagged: true,
      favorite: true,
    },
    {
      id: '4',
      order_number: 'AMT-0002',
      product_name: 'Some Product Name',
      location: 'Primary Location',
      status: 'Pending',
      placed: '7/5/18',
      backordered: '8/5/18',
      qty: '10',
      pkg_price: '$1.00',
      total: '$10.00',
      flagged: false,
      favorite: false,
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
