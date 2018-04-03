import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';

@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.scss']
})
@DestroySubscribers()
export class OrdersTableComponent implements OnInit, OnDestroy {
  public subscribers: any = {};

  ngOnInit() {

  }

  ngOnDestroy() {
    console.log('for unsubscribing');
  }
}
