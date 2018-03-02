import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DestroySubscribers } from 'ngx-destroy-subscribers';

import { Subject } from 'rxjs/Subject';

import { PastOrderService } from '../../../../../../core/services/pastOrder.service';
import { Modal } from 'angular2-modal';
import { ToasterService } from '../../../../../../core/services/toaster.service';
import { ResendOrderModal } from '../../../../resend-order-modal/resend-order-modal.component';
import { ModalWindowService } from '../../../../../../core/services/modal-window.service';
import { OrderTableOnVoidService } from '../../order-table-on-void.service';
import { OrderFlagModalComponent } from '../../../order-flag-modal/order-flag-modal.component';
import { FavoritedListService } from '../../../../services/favorited-list.service';
import { FlaggedListService } from '../../../../services/flagged-list.service';

@Component({
  selector: 'app-order-table-item-action',
  templateUrl: './order-table-item-action.component.html',
})
@DestroySubscribers()

export class OrderTableItemActionComponent implements OnInit, OnDestroy {

  private updateFlagged$: any = new Subject<any>();
  private updateFavorite$: any = new Subject<any>();

  private subscribers: any = {};

  private reorderProduct$:  any = new Subject<any>();

  @Input() i: any;
  @Input() item: any;
  @Input() isShow: boolean;
  @Input() listName: string;
  @Input() uniqueField: string;

  constructor(
    public modal: Modal,
    public pastOrderService: PastOrderService,
    public modalWindowService: ModalWindowService,
    public toasterService: ToasterService,
    public orderTableOnVoidService: OrderTableOnVoidService,
    private favoritedListService: FavoritedListService,
    private flaggedListService: FlaggedListService,
  ) {
  }
  ngOnInit() {

  }

  ngOnDestroy() {
    console.log('for unsubscribing');
  }

  addSubscribers() {

    this.subscribers.updateFlaggedSubscription = this.updateFlagged$
    .switchMap((item: any) => this.flaggedListService.putItem(item))
    .subscribe( res => this.toasterService.pop('', res.flagged ? 'Flagged' : 'Unflagged'),
      err => console.log('error')
    );

    this.subscribers.updateFavoriteSubscription = this.updateFavorite$
    .switchMap((item: any) => this.favoritedListService.postItem(item))
    .subscribe( res => this.toasterService.pop('', res.favorite ? 'Favorite' : 'Unfavorite'),
      err => console.log('error')
    );

    this.subscribers.reorderProductFromOrderSubscription = this.reorderProduct$
    .switchMap((data) => this.pastOrderService.reorder(data))
    .subscribe((res: any) => this.toasterService.pop('', res.msg));

  }

  setFavorite(item) {
    this.updateFavorite$.next(item);
  }

  buyAgainOrder(item) {
    const data = {
      'orders': [
        {
          'order_id': item.order_id,
          'items_ids': [item[this.uniqueField]],
        }
      ]
    };
    this.reorderProduct$.next(data);
  }

  sendToReceiveProduct(item) {
    const queryParams = item.order_id.toString() + '&' + item[this.uniqueField].toString();
    this.pastOrderService.goToReceive(queryParams);
  }

  openResendDialog(item) {
    this.modal
    .open(ResendOrderModal, this.modalWindowService
    .overlayConfigFactoryWithParams(item, true, 'mid'));
  };

  onVoidOrder(item) {
    this.orderTableOnVoidService.onVoidOrder(item);
  }

  openAddCommentModal(item) {
    this.modal
    .open(OrderFlagModalComponent, this.modalWindowService
    .overlayConfigFactoryWithParams(item, true, 'big'))
    .then((resultPromise) => resultPromise.result)
    .then(
      (response) => {
        this.updateFlagged$.next({...item, flagged_comment: response.comment});
      },
      (err) => {
      }
    );
  }

  openShowCommentModal(item) {
    this.toasterService.pop('error', 'Items that have comments cannot be unflagged');
  }

}
