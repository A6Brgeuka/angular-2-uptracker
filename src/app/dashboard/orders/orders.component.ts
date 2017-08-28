import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { PastOrderService } from '../../core/services/pastOrder.service';

import * as _ from 'lodash';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { ModalWindowService } from '../../core/services/modal-window.service';
import { SelectVendorModal } from './select-vendor-modal/select-vendor.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
@DestroySubscribers()
export class OrdersComponent implements OnInit {
  public subscribers: any = {};
  public searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public selectAll: boolean;
  public searchKey: string;
  public sortBy: string;
  public sortBy$: BehaviorSubject<any> = new BehaviorSubject(null);
  public total: number = 6;
  public visible:boolean[] = [];
  private selectAll$:  BehaviorSubject<any> = new BehaviorSubject(false);
  private ordersToReceive$:  any = new Subject<any>();
  private ordersChecked$:  BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public showMenuItem: boolean = true;
  public showMenuReconcile: boolean = false;
  
  constructor(
      public modal: Modal,
      public router: Router,
      public pastOrderService: PastOrderService,
      public modalWindowService: ModalWindowService,
  ) {
  
  }

  ngOnInit() {
    this.subscribers.ordersToReceive = this.ordersToReceive$
    .switchMap(() => {
      return this.pastOrderService.collection$
    })
    .map((product) => {
      let filteredCheckedProducts:any[]  = _.filter(product, 'checked');
      let firstVendor:any = filteredCheckedProducts[0].vendor_name;
      let filteredVendors:any[]  = _.filter(filteredCheckedProducts, item => firstVendor === item.vendor_name);
      
      if(filteredCheckedProducts.length === filteredVendors.length) {
        this.sendToReceiveProducts(filteredCheckedProducts);
      }
      
      else {
        const uniqVendors: any[] = _.uniqBy(filteredCheckedProducts, 'vendor_name');
        this.modal
        .open(SelectVendorModal, this.modalWindowService
        .overlayConfigFactoryWithParams({"vendors": uniqVendors}, true, 'mid'))
        .then((resultPromise) => {
          resultPromise.result.then(
            (selectedVendor) => {
              filteredCheckedProducts = _.filter(filteredCheckedProducts, item => selectedVendor === item.vendor_name);
              this.sendToReceiveProducts(filteredCheckedProducts);
            },
            (err) => {
            }
          );
        });
      }
    })
    .subscribe();
    
    this.subscribers.ordersChecked = this.ordersChecked$
    .switchMap(() => {
      return this.pastOrderService.collection$
    })
    .map(product => {
      let filteredCheckedProducts:any[]  = _.filter(product, 'checked');
      let findNotReceivedProducts:any[] = _.find(filteredCheckedProducts, item => item.status !== 5);
      let findReceivedProducts:any[] = _.find(filteredCheckedProducts, item => item.status === 5);
      this.showMenuItem = (findNotReceivedProducts) ? true : false;
      this.showMenuReconcile = (findReceivedProducts) ? true : false;
    })
    .subscribe();
  }
  
  sendToReceiveProducts(filteredCheckedProducts) {
    let sendItems: any[] = [];
    let sendOrders = filteredCheckedProducts.map((order) => {
      sendItems = sendItems.concat(order.order_items.map((item) => item.id));
      return order.order_id;
    });
    this.subscribers.receiveOrders = this.pastOrderService.getReceive(sendOrders, sendItems)
    .subscribe();
  }
  
  sendToReceiveOrder(order) {
    this.sendToReceiveProducts([order]);
  }
  
  searchFilter(event){
    // replace forbidden characters
    let value = event.target.value.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    this.searchKey$.next(value);
  }

  itemsSort(event) {
    let value = event.target.value;
    this.sortBy$.next(value);
  }
  
  showFiltersModal(){
  }
  
  toggleSelectAll(event) {
    // 0 = unused, 1 = selectAll, 2 = deselectAll
    this.selectAll$.next(event ? 1 : 2);
    this.selectAll$
    .switchMap(() => this.pastOrderService.collection$)
    .subscribe(res => {
      res.map((item)=> {
        item.checked = event;
      })
    })
    
  }
  
  chooseTab(a){
    this.setFilter(a);
  }
  
  setFilter(filter:any){
    //TODO
    console.log(`tab ${filter} enabled`)
  }
  changeVisibility(i){
    this.pastOrderService.itemsVisibility[i] = !this.pastOrderService.itemsVisibility[i];
  }
  
  getOrder(id){
    this.pastOrderService.getPastOrder(id)
    .subscribe((res)=>console.log(res));
  }
  
  onReceiveOrders() {
    this.ordersToReceive$.next([]);
  }
  
  setCheckbox() {
    this.ordersChecked$.next([]);
  }
}
