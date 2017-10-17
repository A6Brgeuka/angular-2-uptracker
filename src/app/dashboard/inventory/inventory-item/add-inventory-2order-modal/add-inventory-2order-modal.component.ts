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
  
    let data = {
      //"location_id": this.inventory.inventory_item_locations[0].location_id,
      //"product_id": this.inventory.inventory_products.id,
      //"variants": [
      //  {
      //    "location_id": this.location,
      //    "vendor_id": this.vendor.vendor_id,
      //    "variant_id": this.vendor.variant_id,
      //    "vendor_variant_id": this.vendor.variant_id,
      //    "qty": parseInt(this.quantity),
      //    "unit_type": this.unit_type,
      //    "vendor_auto_select": this.isAuto,
      //  }
      //]
    };
    
    this.cartService.addToCart(data)
    .subscribe(() => {
      this.toasterService.pop("", this.inventory.name + " successfully added to the shopping list");
      this.dismissModal();
    }, (e) => console.log(e));
  }
  
  dismissModal() {
    this.dialog.dismiss();
  }
  
  closeModal(data) {
    this.dialog.close(data);
  }
  
}