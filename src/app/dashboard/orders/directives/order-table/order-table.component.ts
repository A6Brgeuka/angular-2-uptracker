import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ToasterService } from '../../../../core/services/toaster.service';
import { ModalWindowService } from '../../../../core/services/modal-window.service';
import { PastOrderService } from '../../../../core/services/pastOrder.service';
import { Router } from '@angular/router';
import { Modal } from 'angular2-modal';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as _ from 'lodash';
import { Subject } from 'rxjs/Subject';
import { ResendOrderModal } from '../../resend-order-modal/resend-order-modal.component';
import { ConfirmVoidOrderModal } from '../../order-modals/confirm-void-order-modal/confirm-void-order-modal.component';
import { selectedOrderModel } from '../../../../models/selected-order.model';
import { SelectVendorModal } from '../../select-vendor-modal/select-vendor.component';
import { Observable } from 'rxjs/Observable';
import { OrderTableSortService } from './order-table-sort.service';

@Component( {
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.scss'],
  providers: [
    OrderTableSortService
  ]
})

@DestroySubscribers()

export class OrderTableComponent implements OnInit, OnDestroy {
  @Input('header') public header: any = [];
  @Input('listName') public listName: string = '';
  @Input()
  set orders(value){
    this.orders$.next(value);
  }
  
  
  @Output() sortByHeaderUpdated = new EventEmitter();
  @Output() filterBy = new EventEmitter();
  
  public componentId: string = _.uniqueId();
  public selectAll: boolean;
  public showMenuHeader: boolean = false;
  public subscribers: any = {};
  private reorderProduct$:  any = new Subject<any>();
  public reorderOrders$:  any = new Subject<any>();
  public updateFlagged$: any = new Subject();
  private voidOrder$:  any = new Subject<any>();
  private voidCheckedOrders$:  any = new Subject<any>();
  public selectedOrder: any = new selectedOrderModel;
  
  private orders$:  any = new Subject<any>();
  private filteredOrders$:  Observable<any>
  
  constructor(
    public modal: Modal,
    public router: Router,
    public pastOrderService: PastOrderService,
    public modalWindowService: ModalWindowService,
    public toasterService: ToasterService,
    public orderTableSortService: OrderTableSortService,
  ) {
  
  }
  
  ngOnInit() {
    this.filteredOrders$ = Observable.combineLatest(
      this.orders$,
      this.orderTableSortService.sort$.startWith(null),
    )
    .map(([orders, sort]: [any, any])=>{
      if(!sort){
        return orders;
      }
      return _.orderBy(orders, [sort.alias], [sort.order]);
    })
  }
  
  ngOnDestroy() {
    console.log('for unsubscribing');
  }
  
  addSubscribers() {
  
    this.subscribers.reorderProductFromOrderSubscription = this.reorderProduct$
    .switchMap((data) => this.pastOrderService.reorder(data))
    .subscribe((res: any) => this.toasterService.pop('', res.msg));
  
    this.subscribers.updateFlaggedSubscription = this.updateFlagged$
    .switchMap(item => this.pastOrderService.setFlag(item))
    .subscribe(res => {
        this.toasterService.pop('', res.flagged ? 'Flagged' : 'Unflagged');
      },
      err => console.log('error'));
  
    this.subscribers.voidOrderSubscription = this.voidOrder$
    .switchMap((data: any) => this.pastOrderService.onVoidOrder(data))
    .subscribe();
  
    this.subscribers.reorderOrdersSubscription = this.reorderOrders$
    .switchMap(() =>  {
      const filteredChecked = this.onFilterCheckedOrders();
      const data = {
        'orders': filteredChecked,
      };
      return this.pastOrderService.reorder(data);
    })
    .subscribe(res => this.toasterService.pop('', res.msg));
    
    this.subscribers.onVoidCheckedOrdersSubscription = this.voidCheckedOrders$
      .switchMap(() => {
        const filteredChecked = this.onFilterCheckedOrders();
        const data = {
          'orders': filteredChecked,
        };
        return this.pastOrderService.onVoidOrder(data);
      })
    .subscribe();
  }
  
  onFilterCheckedOrders() {
    const filteredCheckedProducts = _.filter(this.orders, 'checked')
    .map((order: any) => {
      const checkedOrder = new selectedOrderModel(
        Object.assign(order, {
          items_ids: [order.id],
        })
      );
      return checkedOrder;
    });
    return filteredCheckedProducts;
  }
  
  setCheckbox(item) {
    const filteredOrders = _.filter(this.orders, 'checked');
    this.showMenuHeader = (filteredOrders.length) ? true : false;
    this.selectAll = (filteredOrders.length && filteredOrders.length === this.orders.length);
  }
  
  toggleSelectAll(event) {
    this.orders.forEach(order => order.checked = event);
    this.showMenuHeader = event;
  }
  
  buyAgainOrder(item) {
    const data = {
      'orders': [
        {
          'order_id': item.order_id,
          'items_ids': [item.id],
        }
      ]
    };
    this.reorderProduct$.next(data);
  }
  
  buyAgainOrders() {
    this.reorderOrders$.next('');
  }
  
  onVoidOrder(item, checkedOrders = false) {
    this.modal
    .open(ConfirmVoidOrderModal, this.modalWindowService
    .overlayConfigFactoryWithParams('', true, 'mid'))
    .then((resultPromise) => {
      resultPromise.result.then(
        (res) => {
          if (checkedOrders) {
            this.onVoidCheckedOrdersFunc();
          } else {
            this.onVoidOrderFunc(item);
          }
        },
        (err) => {
        }
      );
    });
  }
  
  onVoidOrderFunc(item) {
    const data = {
      'orders': [
        {
          'order_id': item.order_id,
          'items_ids': [item.id],
        }
      ]
    };
    this.voidOrder$.next(data);
  }
  
  onVoidCheckedOrdersFunc() {
    this.voidCheckedOrders$.next('');
  }
  
  sendToReceiveProduct(item) {
    const queryParams = item.order_id.toString() + '&' + item.id.toString();
    this.pastOrderService.goToReceive(queryParams);
  }
  
  onReceiveOrders() {
    let filteredCheckedProducts: any[]  = _.filter(this.orders, 'checked');
    const firstVendor: any = filteredCheckedProducts[0].vendor_name;
    const filteredVendors: any[]  = _.filter(filteredCheckedProducts, item => firstVendor === item.vendor_name);
    if (filteredCheckedProducts.length === filteredVendors.length) {
      this.sendToReceiveProducts(filteredCheckedProducts);
    } else {
        const uniqVendors: any[] = _.uniqBy(filteredCheckedProducts, 'vendor_name');
        this.modal
        .open(SelectVendorModal, this.modalWindowService
        .overlayConfigFactoryWithParams({'vendors': uniqVendors}, true, 'mid'))
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
  }
  
  sendToReceiveProducts(filteredCheckedProducts, singleOrder = false) {
    const sendOrders = filteredCheckedProducts.map((order) => {
      return order.order_id;
    });
    const uniqsendOrders: any[] = _.uniq(sendOrders);
    const sendItems: any[] = filteredCheckedProducts.map((order) => {
      return order.id;
    });
    const queryParams = uniqsendOrders.toString() + '&' + sendItems.toString();
    this.pastOrderService.goToReceive(queryParams);
  }
  
  openResendDialog(item) {
    this.modal
    .open(ResendOrderModal, this.modalWindowService
    .overlayConfigFactoryWithParams(item, true, 'mid'));
  };
  
  setFlag(e, item) {
    e.stopPropagation();
    this.updateFlagged$.next(item);
  }
  
  sortByHeaderCol(headerCol) {
    this.orderTableSortService.sortByAlias(headerCol.alias)
  }
  
  onFilterBy(value) {
    console.log(value, 66666666);
    this.filterBy.emit(value);
  }
  
}
