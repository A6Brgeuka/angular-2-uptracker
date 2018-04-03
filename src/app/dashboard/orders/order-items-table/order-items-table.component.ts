import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';

@Component({
  selector: 'app-order-items-table',
  templateUrl: './order-items-table.component.html',
  styleUrls: ['./order-items-table.component.scss']
})
@DestroySubscribers()
export class OrderItemsTableComponent implements OnInit, OnDestroy {
  public subscribers: any = {};

  ngOnInit() {

  }

  ngOnDestroy() {
    console.log('for unsubscribing');
  }
}
