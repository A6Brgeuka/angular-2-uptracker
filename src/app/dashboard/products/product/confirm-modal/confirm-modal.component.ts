import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash';

import { DialogRef, ModalComponent, CloseGuard, Modal } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { ToasterService } from '../../../../core/services/toaster.service';

export class ConfirmModalContext extends BSModalContext {
  public commentId: any;
  public fn:any;
}

@Component({
  selector: 'app-change-password-user-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
@DestroySubscribers()
export class ConfirmModal implements OnInit, CloseGuard, ModalComponent<ConfirmModalContext> {
  context: ConfirmModalContext;
  
  constructor(
    public dialog: DialogRef<ConfirmModalContext>,
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }
  
  ngOnInit() {
  }
  
  dismissModal() {
    this.dialog.dismiss();
  }
  
  closeModal(data) {
    this.dialog.close(data);
  }

  confirm(){
    this.dialog.context.fn(this.dialog.context.commentId);
    this.dismissModal();
  }
}
