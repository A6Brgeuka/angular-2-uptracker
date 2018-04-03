import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';

@Component({
  selector: 'app-invoices-table',
  templateUrl: './invoices-table.component.html',
  styleUrls: ['./invoices-table.component.scss']
})
@DestroySubscribers()
export class InvoicesTableComponent implements OnInit, OnDestroy {
  public subscribers: any = {};

  ngOnInit() {

  }

  ngOnDestroy() {
    console.log('for unsubscribing');
  }
}
