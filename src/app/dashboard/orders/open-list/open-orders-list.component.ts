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
