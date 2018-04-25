import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DestroySubscribers } from 'ngx-destroy-subscribers';

import { Subject } from 'rxjs/Subject';

import { PastOrderService } from '../../../../../../core/services/pastOrder.service';
import { Modal } from 'angular2-modal';
import { ToasterService } from '../../../../../../core/services/toaster.service';
import { ResendOrderModal } from '../../../../resend-order-modal/resend-order-modal.component';
import { ReconcileOnboardingModal } from '../../../../reconcile-onboarding-modal/reconcile-onboarding-modal.component';
import { ModalWindowService } from '../../../../../../core/services/modal-window.service';
import { OrderTableOnVoidService } from '../../order-table-on-void.service';
import { OrderFlagModalComponent } from '../../../order-flag-modal/order-flag-modal.component';
import { OrderStatus, OrderStatusValues } from '../../../../models/order-status';
import { OrderListType } from '../../../../models/order-list-type';
import { OrderItem } from '../../../../models/order-item';
import { OrdersService } from '../../../../orders.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-order-table-item-action',
  templateUrl: './order-table-item-action.component.html',
})
@DestroySubscribers()

export class OrderTableItemActionComponent implements OnInit, OnDestroy {

  private subscribers: any = {};

  private reorderProductSubject$:  Subject<any> = new Subject<any>();
  private reorderProducts$:  Observable<any>;

  private voidProductSubject$:  Subject<any> = new Subject<any>();

  private receiveProductSubject$:  Subject<any> = new Subject<any>();
  private receiveProducts$:  Observable<any>;

  @Input() i: any;
  @Input() item: any;
  @Input() items: Array<any>;
  @Input() isShow: boolean;
  @Input() listName: string;
  @Input() uniqueField: string;
  @Output() onFavorite: EventEmitter<OrderItem> = new EventEmitter();
  @Output() onFlagged: EventEmitter<OrderItem> = new EventEmitter();
  @Output() onVoid: EventEmitter<OrderItem> = new EventEmitter();

  constructor(
    public modal: Modal,
    public pastOrderService: PastOrderService,
    public modalWindowService: ModalWindowService,
    public toasterService: ToasterService,
    public orderTableOnVoidService: OrderTableOnVoidService,
    public ordersService: OrdersService,
  ) {
  }

  get isRecieveList() {
    return this.listName === OrderListType.received;
  }

  get isBackorderedList() {
    return this.listName === OrderListType.backordered;
  }

  get isBackorderedItem() {
    return this.item.status_int === OrderStatus.backorder;
  }

  get isReceivedItem() {
    return this.item.status_int === OrderStatus.receive;
  }

  get isViodedItem() {
    return this.item.status_int === OrderStatus.void;
  }

  ngOnInit() {
    console.log(`${this.constructor.name} Inits`);

    this.reorderProducts$ = Observable.combineLatest(
      this.ordersService.tableRoute$,
      this.reorderProductSubject$,
    );

    this.receiveProducts$ = Observable.combineLatest(
      this.ordersService.tableRoute$,
      this.receiveProductSubject$,
    );


  }

  ngOnDestroy() {
    console.log('for unsubscribing');
  }

  addSubscribers() {

    this.subscribers.voidProductSubscription = this.voidProductSubject$
    .switchMap((item) =>
      this.orderTableOnVoidService.onVoidOrder(item)
    )
    .subscribe((res) =>
      this.onVoid.emit(res)
    );

    this.subscribers.reorderProductFromOrderSubscription = this.reorderProducts$
    .switchMap(([url, item]) => {
      let data;
      if (url === '/orders/items') {
        data = {
          orders: [
            {
              order_id: item.order_id,
              items_ids: [item[this.uniqueField]],
            }
          ]
        };
      } else if (url === '/orders') {
        data = {
          orders: [
            {
              order_id: item.order_id,
              items_ids: item.order_items.map((res) => res.id),
            }
          ]
        };
      } else if (url === '/orders/invoices') {
        data = {
          orders: [
            {
              order_id: '',
              items_ids: [],
            }
          ]
        };
      } else if (url === '/orders/packing-slips') {
        data = {
          orders: [
            {
              order_id: '',
              items_ids: [],
            }
          ]
        };
      }

      return this.pastOrderService.reorder(data);
    })
    .subscribe((res: any) => this.toasterService.pop('', res.msg));

    this.subscribers.receiveProductSubscription = this.receiveProducts$
    .map(([url, item]) => {
      let queryParams;
      if (url === '/orders/items') {
        queryParams = item.item.order_id.toString() + '&' + item.item[this.uniqueField].toString();
      } else if (url === '/orders') {
        queryParams = item.item.order_id.toString() + '&' + item.item.order_items.map((res) => res.id).toString();
      } else if (url === '/orders/invoices') {
        queryParams = '';
      } else if (url === '/orders/packing-slips') {
        queryParams = '';
      }
      this.pastOrderService.goToReceive(queryParams, item.type);
    })
    .subscribe();

  }

  setFavorite(item) {
    this.onFavorite.emit(item);
  }

  buyAgainOrder(item) {
    this.reorderProductSubject$.next(item);
  }

  openResendDialog(item) {
    this.modal
    .open(ResendOrderModal, this.modalWindowService
    .overlayConfigFactoryWithParams(item, true, 'mid'));
  };

  onVoidOrder(item) {
    this.voidProductSubject$.next(item);
  }

  openAddCommentModal(item) {
    this.modal
    .open(OrderFlagModalComponent, this.modalWindowService
    .overlayConfigFactoryWithParams(item, true, 'big'))
    .then((resultPromise) => resultPromise.result)
    .then(
      (response) => {
        this.onFlagged.emit({...item, flagged_comment: response.comment});
      },
      (err) => {
      }
    );
  }

  openUnflagToaster() {
    this.toasterService.pop('error', 'You cannot unflag a product with active comments');
  }

  receive() {
    this.sendToReceiveProduct(this.item, OrderStatusValues.receive);
  }

  reconcile() {
    this.modal
    .open(ReconcileOnboardingModal, this.modalWindowService
    .overlayConfigFactoryWithParams({order: this.item, orders: this.items}));
  }

  backorder() {
    this.sendToReceiveProduct(this.item, OrderStatusValues.backorder);
  }

  edit() {
    this.sendToReceiveProduct(this.item);
  }

  private sendToReceiveProduct(item, type?) {
    this.receiveProductSubject$.next({item, type});
  }

}
