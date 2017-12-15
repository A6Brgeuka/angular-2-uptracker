import { Component, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { PastOrderService } from '../../../core/services/pastOrder.service';

import * as _ from 'lodash';
import { Subject } from 'rxjs/Subject';
import { ToasterService } from '../../../core/services/toaster.service';

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
  private ordersChecked$:  BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public reorderReceivedOrder$: any = new Subject();
  
  public showMenuItem: boolean = true;
  
  constructor(
    public pastOrderService: PastOrderService,
    public toasterService: ToasterService,
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
          res = _.forEach(res, (item: any) => {
            item.checked = select;
            item.items.map(product => product.checked = select);
          });
          return res;
        })
      })
      .subscribe();
  
    this.subscribers.ordersCheckedSubscription = this.ordersChecked$
    .switchMap(() =>
      this.receivedOrders$
    )
    .map(product => {
      let filteredCheckedProducts:any[]  = _.filter(product, 'checked');
      this.selectAllReceivedList = (filteredCheckedProducts.length && (filteredCheckedProducts.length === product.length));
      this.showMenuItem = !!filteredCheckedProducts.length;
    })
    .subscribe();
  
    this.subscribers.reorderSubscription = this.reorderReceivedOrder$
    .switchMap(data => this.pastOrderService.reorder(data))
    .subscribe(res =>
      this.toasterService.pop('', res.msg)
    )
    
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
  
  setCheckbox(item) {
    item.items.map(order_item => order_item.checked = item.checked);
    this.ordersChecked$.next([]);
  }
  
  setOrderCheckbox() {
    this.ordersChecked$.next([]);
  }
  
  buyAgainReceivedOrder(order) {
    let data = {
      "order_id": order.id,
      "items_ids":[],
    };
    this.reorderReceivedOrder$.next(data);
  }
  
}
