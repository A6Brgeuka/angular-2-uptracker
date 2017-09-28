import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { CartService } from '../../../../core/services/cart.service';
import { ToasterService } from '../../../../core/services/toaster.service';

export class AddInventory2OrderModalContext extends BSModalContext {
  public data: any;
}

@Component({
  selector: 'add-inventory-2order-modal',
  templateUrl: './add-inventory-2order-modal.component.html',
  styleUrls: ['./add-inventory-2order-modal.component.scss']
})

export class AddInventory2OrderModal implements OnInit, CloseGuard, ModalComponent<AddInventory2OrderModalContext> {
  context: AddInventory2OrderModalContext;
  public inventory: any;
  
  constructor(
    public dialog: DialogRef<AddInventory2OrderModalContext>,
    public cartService: CartService,
    public toasterService: ToasterService,
  ) {
    this.inventory = dialog.context.data;
    console.log(this.inventory);
    dialog.setCloseGuard(this);
  }
  
  ngOnInit() {
  
  }
  
  saveOrder() {

  }
  
  dismissModal() {
    this.dialog.dismiss();
  }
  
  closeModal(data) {
    this.dialog.close(data);
  }
  
}