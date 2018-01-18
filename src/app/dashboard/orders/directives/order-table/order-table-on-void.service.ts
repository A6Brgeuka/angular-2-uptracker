import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import { Modal } from 'angular2-modal';
import { Subject } from 'rxjs/Subject';

import { ConfirmVoidOrderModal } from '../../order-modals/confirm-void-order-modal/confirm-void-order-modal.component';
import { PastOrderService } from '../../../../core/services/pastOrder.service';
import { ModalWindowService } from '../../../../core/services/modal-window.service';
import { ToasterService } from '../../../../core/services/toaster.service';
import { OrderTableService } from './order-table.service';
import { selectedOrderModel } from '../../../../models/selected-order.model';


@Injectable()
export class OrderTableOnVoidService {
  private voidOrder$: Subject<any>;
  private voidCheckedOrders$: Subject<any>;
  
  constructor(
    public modal: Modal,
    public pastOrderService: PastOrderService,
    public modalWindowService: ModalWindowService,
    public toasterService: ToasterService,
    public orderTableService: OrderTableService,
  ) {
    this.voidOrder$ = new Subject<any>();
    this.voidCheckedOrders$ = new Subject<any>();
    
    this.voidOrder$
    .switchMap((data: any) => this.pastOrderService.onVoidOrder(data))
    .subscribe();
  
    this.voidCheckedOrders$
    .switchMap((orders) => {
      const filteredChecked = this.onFilterCheckedOrders(orders);
      const data = {
        'orders': filteredChecked,
      };
      return this.pastOrderService.onVoidOrder(data);
    })
    .subscribe();
  }
  
  onVoidOrder(data) {
    this.modal
    .open(ConfirmVoidOrderModal, this.modalWindowService
    .overlayConfigFactoryWithParams('', true, 'mid'))
    .then((resultPromise) => {
      resultPromise.result.then(
        (res) => {
          if (_.isArray(data)) {
            this.onVoidCheckedOrdersFunc(data);
          } else {
            this.onVoidOrderFunc(data);
          }
        },
        (err) => {
        }
      );
    });
  }
  onFilterCheckedOrders(orders) {
    return orders
    .map((order: any) => {
      return new selectedOrderModel(
        Object.assign(order, {
          items_ids: [order.id],
        })
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
  
  onVoidCheckedOrdersFunc(orders) {
    this.voidCheckedOrders$.next(orders);
  }
}