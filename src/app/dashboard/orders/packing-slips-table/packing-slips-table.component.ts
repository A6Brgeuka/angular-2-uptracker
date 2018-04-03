import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';

@Component({
  selector: 'app-packing-slips-table',
  templateUrl: './packing-slips-table.component.html',
  styleUrls: ['./packing-slips-table.component.scss']
})
@DestroySubscribers()
export class PackingSlipsTableComponent implements OnInit, OnDestroy {
  public subscribers: any = {};

  ngOnInit() {

  }

  ngOnDestroy() {
    console.log('for unsubscribing');
  }
}
