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
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
@DestroySubscribers()
export class OrdersComponent implements OnInit {
  public subscribers: any = {};
  public searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public orders$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public selectAll: boolean;
  public searchKey: string;
  public sortBy: string;
  public sortBy$: BehaviorSubject<any> = new BehaviorSubject(null);
  public filterTabBy$: BehaviorSubject<any> = new BehaviorSubject(null);
  public total$: BehaviorSubject<any> = new BehaviorSubject(null);
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
    
    }

  addSubscribers() {
    this.subscribers.getCollectionSubscription = this.pastOrderService.getPastOrders()
    .subscribe(orders => {
        this.pastOrderService.loadCollection$.next(orders);
        this.pastOrderService.itemsVisibility = new Array(orders.length).fill(false);
    });
    
    this.subscribers.ordersSubscription = Observable.combineLatest(
      this.pastOrderService.collection$,
      this.filterTabBy$
    )
    .subscribe(([r, f]) => {
      this.total$.next(r.length);
      if (f && f !== 'All') {
        let orders = _.filter(r, ['status', f]);
        this.total$.next(orders.length);
        this.orders$.next(orders);
      }
      else {
        this.orders$.next(r);
      }
    });
    
    this.subscribers.ordersToReceive = this.ordersToReceive$
    .switchMapTo(
      this.orders$
    )
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
    
    this.subscribers.ordersCheckedSubscription = this.ordersChecked$
    .switchMap(() => {
      return this.orders$
    })
    .map(product => {
      let filteredCheckedProducts:any[]  = _.filter(product, 'checked');
      let findNotReceivedProducts:any[] = _.find(filteredCheckedProducts, item => item.status !== 'Received');
      let findReceivedProducts:any[] = _.find(filteredCheckedProducts, item => item.status === 'Received');
      this.showMenuItem = !!(findNotReceivedProducts);
      this.showMenuReconcile = !!(findReceivedProducts);
    })
    .subscribe();
  }
  
  sendToReceiveProducts(filteredCheckedProducts) {
    let sendItems: any[] = [];
    let sendOrders = filteredCheckedProducts.map((order) => {
      sendItems = sendItems.concat(order.order_items.map((item) => item.id));
      return order.order_id;
    });
    let queryParams = sendOrders.toString() + '&' + sendItems.toString();
    this.pastOrderService.goToReceive(queryParams);
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
    this.subscribers.selectAllSubscription = this.selectAll$
    .switchMap(() => this.pastOrderService.collection$)
    .subscribe(res => {
      res.map((item)=> {
        item.checked = event;
      })
    });
    this.ordersChecked$.next([]);
  }
  
  chooseTab(a){
    this.setFilter(a);
  }
  
  setFilter(filter:any){
    this.filterTabBy$.next(filter);
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
