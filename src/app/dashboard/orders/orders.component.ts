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
        this.pastOrderService.ordersToReceive$.next(filteredCheckedProducts);
        this.router.navigate(['orders/receive']);
      }
      else {
        // const allVendors: any[] = filteredCheckedProducts.map(product => product.vendor_name);
        const uniqVendors: any[] = _.uniqBy(filteredCheckedProducts, 'vendor_name');
        this.modal
        .open(SelectVendorModal, this.modalWindowService
        .overlayConfigFactoryWithParams({"vendors": uniqVendors}, true, 'mid'))
        .then((resultPromise) => {
          resultPromise.result.then(
            (res) => {
              // this.filterProducts();
            },
            (err) => {
            }
          );
        });
      }
    })
    .subscribe()
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
    this.onCheck();
    this.selectAll$
    .switchMap(() => this.pastOrderService.collection$)
    .subscribe(res => {
      res.map((item)=> {
        item.checked = event;
      })
    })
    
  }
  
  onCheck() {
  
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
  
}
