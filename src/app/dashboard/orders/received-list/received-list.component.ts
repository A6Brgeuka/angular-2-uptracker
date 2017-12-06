import { Component, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { PastOrderService } from '../../../core/services/pastOrder.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-received-list',
  templateUrl: './received-list.component.html',
  styleUrls: ['./received-list.component.scss']
})
@DestroySubscribers()
export class ReceivedListComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  public selectAllReceivedList: boolean = false;
  
  public receivedOrders$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private selectAllReceivedList$:  ReplaySubject<any> = new ReplaySubject(1);
  
  constructor(
    public pastOrderService: PastOrderService,
  ) {

  }
  
  ngOnInit() {

  }
  
  addSubscribers() {
    
    this.subscribers.getReceivedProductSubscription = this.pastOrderService.getReceivedProducts()
    .subscribe(res => {
      console.log(res);
      this.pastOrderService.itemsVisibilityReceivedList = new Array(res.length).fill(false);
        this.receivedOrders$.next(res);
    });
  
    this.subscribers.selectAllListSubscription =
      this.selectAllReceivedList$
      .switchMap(select => {
        return this.receivedOrders$.first()
        .map(res => {
          //let status = select ? 1 : 0;
          res = _.forEach(res, (item: any) => {
            item.checked = select;
          });
          return res;
        })
      })
      .subscribe();
    
  }
  
  ngOnDestroy() {
    console.log('for unsubscribing')
  }
  
  toggleSelectAllReceivedList(selectAllReceivedList) {
    this.selectAllReceivedList$.next(!selectAllReceivedList);
  }
  
  changeVisibilityReceivedList(i){
    this.pastOrderService.itemsVisibilityReceivedList[i] = !this.pastOrderService.itemsVisibilityReceivedList[i];
  }
  
}
