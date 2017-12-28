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
  public reorderReceivedCheckedItems$: any = new Subject();
  public editReceivedCheckedItems$: any = new Subject();
  
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
      this.pastOrderService.itemsVisibilityReceivedList = new Array(res.length).fill(false);
        this.receivedOrders$.next(res);
        this.pastOrderService.totalReceived$.next(res.length);
    });
  
    this.subscribers.selectAllListSubscription =
      this.selectAllReceivedList$
      .switchMap(select => {
        return this.receivedOrders$.first()
        .map(res => {
          this.showMenuItem = select;
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
    );
  
    this.subscribers.reorderCheckedItemsSubscription = this.reorderReceivedCheckedItems$
    .switchMapTo(this.receivedOrders$)
    .map((receivedOrders: any) => {
      let takeItemsFromPackingSlip = _.flatMap(_.map(receivedOrders, 'items'));
      let checkedItems = _.filter(takeItemsFromPackingSlip, 'checked');
      let data = {
        "orders": checkedItems.map((item: any) => {
          item.items_ids = [item.item_id];
          return item;
        })
      };
      this.reorderReceivedOrder$.next(data);
    })
    .subscribe();
    
    //this.subscribers.editCheckedItemsSubscription = this.editReceivedCheckedItems$
    //.switchMapTo(this.receivedOrders$)
    //.map((receivedOrders: any) => {
    //  let takeItemsFromPackingSlip = _.flatMap(_.map(receivedOrders, 'items'));
    //  let checkedItems = _.filter(takeItemsFromPackingSlip, 'checked');
    //  let sendOrders: any[] = [];
    //  let sendItems: any[] = [];
    //
    //  checkedItems.map((item:any)=> {
    //    sendOrders.push(item.order_id);
    //    sendItems.push(item.item_id);
    //  });
    //  let queryParams = sendOrders.toString() + '&' + sendItems.toString();
    //  this.pastOrderService.goToReceive(queryParams);
    //})
    //.subscribe();
    
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
      "orders": order.items.map(item => {
        item.items_ids = [item.item_id];
        return item;
      }),
    };
    this.reorderReceivedOrder$.next(data);
  }
  
  buyAgainReceivedCheckedOrders() {
    this.reorderReceivedCheckedItems$.next('');
  }
  
  editReceivedPackingSlip(packingSlip) {
    
    let sendOrders: any[] = [];
    let sendItems: any[] = [];
    
    packingSlip.items.map(item => {
      sendOrders.push(item.order_id);
      sendItems.push(item.item_id);
    });
    let queryParams = _.uniqBy(sendOrders, '').toString() + '&' + sendItems.toString();
    this.pastOrderService.goToReceive(queryParams);
  }
  
  editCheckedReceivedPackingSlips() {
    //this.editReceivedCheckedItems$.next('');
  }
  
}
