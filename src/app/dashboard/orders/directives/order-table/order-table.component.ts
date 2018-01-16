import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component( {
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.scss']
})

@DestroySubscribers()

export class OrderTableComponent implements OnInit, OnDestroy {
  @Input('header') public header: any = [];
  @Input('orders') public orders: any = [];
  @Input('listName') public listName: string = '';
  
  public selectAll: boolean;
  public showMenuHeader: boolean = false;
  public subscribers: any = {};
  private reorderProduct$:  any = new Subject<any>();
  public reorderOrders$:  any = new Subject<any>();
  public updateFlagged$: any = new Subject();
  private voidOrder$:  any = new Subject<any>();
  private voidCheckedOrders$:  any = new Subject<any>();
  
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
    
    //this.subscribers.onVoidCheckedOrdersSubscription = this.voidCheckedOrders$
    //.switchMapTo(this.orders$.first())
    //.filter(ord => ord)
    //.map((orders:any) => {
    //  let filteredCheckedOrders = this.onFilterCheckedProduct(orders);
    //  return this.onFilterCheckedItems(filteredCheckedOrders);
    //})
    //.switchMap((data: any) => this.pastOrderService.onVoidOrder(data))
    //.subscribe();
  }
  
  onFilterCheckedOrders() {
    const filteredCheckedProducts = _.filter(this.orders, 'checked')
    .map((order: any) => {
      order.item_ids = [order.product_id];
      return order;
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
          'items_ids': [item.product_id],
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
          'items_ids': [],
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
  
  openResendDialog(item) {
    this.modal
    .open(ResendOrderModal, this.modalWindowService
    .overlayConfigFactoryWithParams(item, true, 'mid'));
  };
  
  setFlag(e, item) {
    e.stopPropagation();
    this.updateFlagged$.next(item);
  }
  
}
