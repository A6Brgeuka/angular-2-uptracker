import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import * as _ from 'lodash';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Modal } from 'angular2-modal';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { ReconcileOnboardingModal } from '../../../reconcile-onboarding-modal/reconcile-onboarding-modal.component';
import { OrderTableService } from '../order-table.service';
import { PastOrderService } from '../../../../../core/services/pastOrder.service';
import { ModalWindowService } from '../../../../../core/services/modal-window.service';
import { SelectVendorModal } from '../../../select-vendor-modal/select-vendor.component';
import { ToasterService } from '../../../../../core/services/toaster.service';
import { OrderTableOnVoidService } from '../order-table-on-void.service';
import { OrderStatusValues } from '../../../models/order-status';
import { OrderListType } from '../../../models/order-list-type';
import { OrdersService } from '../../../orders.service';


@Component({
  selector: 'app-order-table-header-action',
  templateUrl: './order-table-header-action.component.html',
})
@DestroySubscribers()
export class OrderTableHeaderActionComponent implements OnInit, OnDestroy {

  public reorderOrdersSubject$: Subject<any> = new Subject<any>();
  public reorderOrders$: Observable<any>;

  private receiveOrdersSubject$:  Subject<any> = new Subject<any>();
  private receiveOrders$:  Observable<any>;

  private voidProductsSubject$:  Subject<any> = new Subject<any>();

  @Input() listName: string;
  @Input() isShow: boolean;
  @Input() orders: any;
  @Output() onVoid: EventEmitter<any> = new EventEmitter();

  private subscribers: any = {};

  constructor(
    public modal: Modal,
    public pastOrderService: PastOrderService,
    public modalWindowService: ModalWindowService,
    public toasterService: ToasterService,
    public orderTableService: OrderTableService,
    public orderTableOnVoidService: OrderTableOnVoidService,
    public ordersService: OrdersService,
  ) {
  }

  get isReceiveList() {
    return this.listName === OrderListType.received;
  }

  get isBackorderedList() {
    return this.listName === OrderListType.backordered;
  }

  ngOnInit() {
    this.reorderOrders$ = Observable.combineLatest(
      this.ordersService.tableRoute$,
      this.reorderOrdersSubject$,
    );

    this.receiveOrders$ = Observable.combineLatest(
      this.ordersService.tableRoute$,
      this.receiveOrdersSubject$,
    );
  }

  ngOnDestroy() {
    console.log(`${this.constructor.name} Destroys`);
  }

  addSubscribers() {

    this.subscribers.reorderOrdersSubscription = this.reorderOrders$
    .switchMap(([url, items]) => {
      const filteredChecked = this.onFilterCheckedOrders(url);
      const data = {orders: filteredChecked};
      return this.pastOrderService.reorder(data);
    })
    .subscribe((res: any) => this.toasterService.pop('', res.msg));

    this.subscribers.receiveOrdersSubscription = this.receiveOrders$
    .map(([url, orders]) => {
      const sendOrders = orders.filteredCheckedProducts.map((order) =>
        order.order_id
      );
      let sendItems: any[];
      const uniqsendOrders: any[] = _.uniq(sendOrders);
      if (url === '/orders/items') {
        sendItems = orders.filteredCheckedProducts.map((order) =>
          order.id
        );
      } else if (url === '/orders') {
        sendItems = orders.filteredCheckedProducts.map((order) =>
          order.order_items.map((item) => item.id));
      } else if (url === '/orders/invoices') {
        sendItems = [];
      } else if (url === '/orders/packing-slips') {
        sendItems = [];
      };
      const queryParams = uniqsendOrders.toString() + '&' + sendItems.toString();
      this.pastOrderService.goToReceive(queryParams, orders.type);
    })
    .subscribe();

    this.subscribers.voidProductsSubscription = this.voidProductsSubject$
    .switchMap((item) =>
      this.orderTableOnVoidService.onVoidOrder(item)
    )
    .subscribe((res) =>
      this.onVoid.emit(res)
    );

  }

  onFilterCheckedOrders(url) {
    if (url === '/orders/items') {
      return this.orders
      .map((order: any) => ({
          order_id: order.order_id,
          items_ids: [order.id],
        })
      );
    } else if (url === '/orders') {
      return this.orders
      .map((order: any) => ({
          order_id: order.order_id,
          items_ids: order.order_items.map((res) => res.id),
        })
      );
    } else if (url === '/orders/invoices') {
      return this.orders
      .map((order: any) => ({
          order_id: '',
          items_ids: [],
        })
      );
    } else if (url === '/orders/packing-slips') {
      return this.orders
      .map((order: any) => ({
          order_id: '',
          items_ids: [],
        })
      );
    }
  }

  sendToReceiveProducts(filteredCheckedProducts, type?) {
    this.receiveOrdersSubject$.next({filteredCheckedProducts, type});
  }

  buyAgainOrders() {
    this.reorderOrdersSubject$.next('');
  }

  onVoidOrder() {
    this.voidProductsSubject$.next(this.orders);
  }

  edit() {
    this.onReceiveOrders();
  }

  receive() {
    this.onReceiveOrders(OrderStatusValues.receive);
  }

  backorder() {
    this.onReceiveOrders(OrderStatusValues.backorder);
  }

  reconcile() {
    this.modal
    .open(ReconcileOnboardingModal, this.modalWindowService
    .overlayConfigFactoryWithParams({orders: this.orders}));
  }

  private onReceiveOrders(type?) {
    const uniqOrdersByVendors = _.uniqBy(this.orders, 'vendor_id');

    if (uniqOrdersByVendors.length === 1) {
      this.sendToReceiveProducts(this.orders, type);
    } else {
      this.modal
      .open(SelectVendorModal, this.modalWindowService
      .overlayConfigFactoryWithParams({'vendors': uniqOrdersByVendors}, true, 'mid'))
      .then((resultPromise) => resultPromise.result)
      .then(
        (selectedVendor) => {
          const filteredOrders = _.filter(this.orders, (item: any) => selectedVendor === item.vendor_name);
          this.sendToReceiveProducts(filteredOrders, type);
        },
        (err) => {
        }
      );
    }
  }

}
