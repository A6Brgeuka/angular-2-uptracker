import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { ToasterService } from '../../core/services/toaster.service';
import { ResendOrderModal } from './resend-order-modal/resend-order-modal.component';
import { ConfirmVoidOrderModal } from './order-modals/confirm-void-order-modal/confirm-void-order-modal.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
@DestroySubscribers()
export class OrdersComponent implements OnInit, OnDestroy, AfterViewInit {
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
  private reorder$:  any = new Subject<any>();
  private voidOrder$:  any = new Subject<any>();
  private voidCheckedOrders$:  any = new Subject<any>();
  public reorderOrders$:  any = new Subject<any>();
  
  private ordersChecked$:  BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public showMenuItem: boolean = true;
  
  public updateFlagged$: any = new Subject();
  
  @ViewChild('allTab') allTab: ElementRef;
  
  constructor(
      public modal: Modal,
      public router: Router,
      public pastOrderService: PastOrderService,
      public modalWindowService: ModalWindowService,
      public toasterService: ToasterService,
  ) {
  
  }

  ngOnInit() {
  
  }
  
  ngAfterViewInit() {
    this.allTab.nativeElement.click();
  }
  
  ngOnDestroy() {
    console.log('for unsubscribing')
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
    .filter(ord => ord)
    .map((orders) => {
      
      let filteredCheckedProducts:any[]  = this.onFilterCheckedProduct(orders);
      
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
    .switchMap(() =>
      this.orders$
    )
    .filter(ord => ord)
    .map(orders => {
      let filteredCheckedOrders:any[]  = _.filter(orders, 'checked');
      let filteredCheckedProducts: any[] = [];
      let findFilteredCheckedProducts = orders.map((order) => {
        filteredCheckedProducts = filteredCheckedProducts.concat(_.filter(order.order_items, 'checked'));
      });
      this.selectAll = (filteredCheckedOrders.length && (filteredCheckedOrders.length === orders.length));
      this.showMenuItem = !!(filteredCheckedOrders.length || filteredCheckedProducts.length);
    })
    .subscribe();
  
    this.subscribers.selectAllSubscription = Observable.combineLatest(
        this.pastOrderService.collection$,
        this.selectAll$,
      )
    .subscribe(([res, select]) =>
      res.map(item => {
        item.checked = select;
        item.order_items.map(product => product.checked = select);
      })
    );
  
    this.subscribers.updateFlaggedSubscription = this.updateFlagged$
    .switchMap(order => this.pastOrderService.setFlag(order))
    .subscribe(res => {
        this.toasterService.pop('', res.flagged ? 'Flagged' : "Unflagged");
      },
      err => console.log('error'));
  
    this.subscribers.reorderSubscription = this.reorder$
    .switchMap(data => this.pastOrderService.reorder(data))
    .subscribe(res =>
      this.toasterService.pop('', res.msg)
    );
    
    this.subscribers.reorderOrdersSubscription = this.reorderOrders$
    .switchMapTo(this.orders$)
    .filter(ord => ord)
    .map((orders) => {
      let filteredCheckedOrders = this.onFilterCheckedProduct(orders);
      return this.onFilterCheckedItems(filteredCheckedOrders);
    })
    .switchMap((data:any) => this.pastOrderService.reorder(data))
    .subscribe(res => this.toasterService.pop('', res.msg));
    
    this.subscribers.voidOrderSubscription = this.voidOrder$
    .switchMap((data:any) => this.pastOrderService.onVoidOrder(data))
    .subscribe();
    
    this.subscribers.onVoidCheckedOrdersSubscription = this.voidCheckedOrders$
    .switchMapTo(this.orders$.first())
    .filter(ord => ord)
    .map((orders:any) => {
      let filteredCheckedOrders = this.onFilterCheckedProduct(orders);
      return this.onFilterCheckedItems(filteredCheckedOrders);
    })
    .switchMap((data:any) => this.pastOrderService.onVoidOrder(data))
    .subscribe();
    
    
  }
  
  onFilterCheckedProduct(orders) {
    let filteredCheckedProducts: any[] = _.filter(orders,
      (order: any) => _.find(order.order_items, 'checked')
    );
    return filteredCheckedProducts;
  }
  
  onFilterCheckedItems(filteredCheckedOrders) {
    filteredCheckedOrders.map(item => {
      item.items_ids = [];
      item.order_items = _.filter(item.order_items, 'checked');
      item.items_ids = item.items_ids.concat(item.order_items.map((item) => item.id))
    });
    let data = {
      "orders": filteredCheckedOrders
    };
    return data;
  }
  
  sendToReceiveProducts(filteredCheckedProducts, singleOrder = false) {
    let sendItems: any[] = [];
    let sendOrders = filteredCheckedProducts.map((order) => {
      if (!singleOrder) {
        order.order_items = _.filter(order.order_items, 'checked');
      }
      sendItems = sendItems.concat(order.order_items.map((item) => item.id));
      return order.order_id;
    });
    let queryParams = sendOrders.toString() + '&' + sendItems.toString();
    this.pastOrderService.goToReceive(queryParams);
  }
  
  sendToReceiveOrder(order) {
    let singleOrder = true;
    this.sendToReceiveProducts([order], singleOrder);
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
    this.selectAll$.next(event);
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
  
  onReceiveOrders() {
    this.ordersToReceive$.next([]);
  }
  
  setCheckbox(item) {
    item.order_items.map(order_item => order_item.checked = item.checked);
    this.ordersChecked$.next([]);
  }
  
  setOrderCheckbox(item) {
    this.ordersChecked$.next([]);
  }
  
  setFlag(e, order) {
    e.stopPropagation();
    this.updateFlagged$.next(order);
  }
  
  buyAgainOrder(order) {
    let data = {
      "orders": [
        {
          "order_id": order.order_id,
          "items_ids":[],
        }
      ]
    };
    this.reorder$.next(data);
  }
  
  buyAgainOrders() {
    this.reorderOrders$.next('');
  }
  
  openResendDialog(item) {
    this.modal
    .open(ResendOrderModal, this.modalWindowService
    .overlayConfigFactoryWithParams(item, true, 'mid'))
  };
  
  onVoidOrder(order, checkedOrders = false) {
    this.modal
    .open(ConfirmVoidOrderModal, this.modalWindowService
    .overlayConfigFactoryWithParams('', true, 'mid'))
    .then((resultPromise) => {
      resultPromise.result.then(
        (res) => {
          if (checkedOrders) {
            this.onVoidCheckedOrdersFunc()
          } else {
            this.onVoidOrderFunc(order);
          }
        },
        (err) => {
        }
      );
    });
  }
  
  onVoidOrderFunc(order) {
    let data = {
      "orders": [
        {
          "order_id": order.order_id,
          "items_ids":[],
        }
      ]
    };
    this.voidOrder$.next(data);
  }
  
  onVoidCheckedOrdersFunc() {
    this.voidCheckedOrders$.next('');
  }
  
}
