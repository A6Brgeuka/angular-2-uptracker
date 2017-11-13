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

@DestroySubscribers()

export class AddInventory2OrderModal implements OnInit, CloseGuard, ModalComponent<AddInventory2OrderModalContext> {
  context: AddInventory2OrderModalContext;
  public subscribers: any = {};
  public inventory: any;
  public defaultProduct: any;
  
  constructor(
    public dialog: DialogRef<AddInventory2OrderModalContext>,
    public cartService: CartService,
    public toasterService: ToasterService,
  ) {
    this.inventory = dialog.context.data;
    dialog.setCloseGuard(this);
  }
  
  ngOnInit() {
    let isDefaulProduct = _.find(this.inventory.inventory_products, 'default_product');
    this.defaultProduct = (isDefaulProduct) ? isDefaulProduct : this.inventory.inventory_products[0];
    this.defaultProduct.location_id = this.inventory.inventory_item_locations[0].location_id;
    this.defaultProduct.on_hand = this.inventory.inventory_item_locations[0].on_hand;
  }
  
  saveOrder() {
  let noVendorAutoSelect = !!(this.defaultProduct.vendor_id);
  
    let data = {
      "product_id": this.defaultProduct.product_id,
      "account_product_id": this.defaultProduct.account_product_id,
      "variants": [
        {
          "location_id": this.defaultProduct.location_id,
          "variant_id": this.defaultProduct.variant_id,
          "account_variant_id": this.defaultProduct.account_variant_id,
          "vendor_variant_id": null,
          "vendor_id": this.defaultProduct.vendor_id,
          "qty": this.defaultProduct.on_hand,
          "vendor_auto_select": !noVendorAutoSelect,
          "unit_type": this.inventory.inventory_by,
        }
      ]
    };
    
   this.subscribers.addToCartSubscription = this.cartService.addToCart(data)
    .subscribe(() => {
      this.toasterService.pop("", this.defaultProduct.name + " successfully added to the shopping list");
      this.dismissModal();
    }, (error) => console.log(error));
  }
  
  dismissModal() {
    this.dialog.dismiss();
  }
  
  closeModal(data) {
    this.dialog.close(data);
  }
  
}