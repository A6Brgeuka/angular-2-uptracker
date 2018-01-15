import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ToasterService } from '../../../../core/services/toaster.service';
import { ModalWindowService } from '../../../../core/services/modal-window.service';
import { PastOrderService } from '../../../../core/services/pastOrder.service';
import { Router } from '@angular/router';
import { Modal } from 'angular2-modal';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Subject } from 'rxjs/Subject';
import { ResendOrderModal } from '../../resend-order-modal/resend-order-modal.component';

@Component( {
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.scss']
})

@DestroySubscribers()

export class OrderTableComponent implements OnInit, OnDestroy {
  @Input('header') public header: any = [];
  @Input('orders') public orders: any = [];
  
  public selectAll: boolean;
  public subscribers: any = {};
  private reorderProduct$:  any = new Subject<any>();
  public updateFlagged$: any = new Subject();
  
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
        this.toasterService.pop('', res.flagged ? 'Flagged' : "Unflagged");
      },
      err => console.log('error'));
  }
  
  setCheckbox(item) {
  
  }
  
  toggleSelectAll(event) {
    this.orders.forEach(order => order.checked = event);
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
  
  onVoidOrder(item) {
  
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
