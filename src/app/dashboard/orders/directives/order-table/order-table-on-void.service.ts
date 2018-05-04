import { Injectable } from '@angular/core';

import { Modal } from 'angular2-modal';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';

import { ModalWindowService } from '../../../../core/services/modal-window.service';
import { ToasterService } from '../../../../core/services/toaster.service';
import { OrderTableService } from './order-table.service';
import { AddCommentModalComponent } from '../../../../shared/modals/add-comment-modal/add-comment-modal.component';
import { OrdersService } from '../../orders.service';
import { ConnectableObservable } from 'rxjs/Rx';


@Injectable()
export class OrderTableOnVoidService {
  private voidCheckedOrders$: Subject<any>;
  private openConfirmVoidModal$: Subject<any>;
  private voidOrder$: ConnectableObservable<any>;

  constructor(
    public modal: Modal,
    public modalWindowService: ModalWindowService,
    public toasterService: ToasterService,
    public orderTableService: OrderTableService,
    public ordersService: OrdersService,
  ) {
    this.voidCheckedOrders$ = new Subject<any>();
    this.openConfirmVoidModal$ = new Subject();

    this.voidOrder$ = this.openConfirmVoidModal$
    .map((data) => _.isArray(data) ? [...data] : [data])
    .switchMap((orders) =>
      Observable.fromPromise(
        this.modal
        .open(AddCommentModalComponent, this.modalWindowService
        .overlayConfigFactoryWithParams({
          title: `Why are you voiding this item${orders.length > 1 ? 's' : ''}?`,
          placeholder: 'Message'
        }, true, 'mid'))
        .then((resultPromise) => resultPromise.result)
      )
      .catch(() => Observable.never())
      .map((result) =>
        orders.map((item) => ({item, message: result.body}))
      )
    ).publish();
    this.voidOrder$.connect();

  }

  onVoidOrder(data) {
    this.openConfirmVoidModal$.next(data);
    return this.voidOrder$;
  }

}
