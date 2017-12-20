import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { DialogRef, ModalComponent, CloseGuard, Modal } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

export class ConfirmVoidOrderContext extends BSModalContext {
  public order:any = {};
}

@Component({
  selector: 'app-confirm-void-order-modal',
  templateUrl: './confirm-void-order-modal.component.html',
  styleUrls: ['./confirm-void-order-modal.component.scss']
})
@DestroySubscribers()
export class ConfirmVoidOrderModal implements OnInit, CloseGuard, ModalComponent<ConfirmVoidOrderContext> {
  context: ConfirmVoidOrderContext;
  
  constructor(
    public dialog: DialogRef<ConfirmVoidOrderContext>,
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }
  
  ngOnInit() {
    console.log(this.context);
  }
  
  dismissModal() {
    this.dialog.dismiss();
  }
  
  closeModal(data) {
    this.dialog.close(data);
  }
  
}
