import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash';

import { DialogRef, ModalComponent, CloseGuard, Modal } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { ToasterService } from '../../../../core/services/toaster.service';

export class Add2OrderModalContext extends BSModalContext {
  public data: any;
}

@Component({
  selector: 'app-change-password-user-modal',
  // TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './add2order-modal.component.html',
  styleUrls: ['./add2order-modal.component.scss']
})
@DestroySubscribers()
export class Add2OrderModal implements OnInit, CloseGuard, ModalComponent<Add2OrderModalContext> {
  context: Add2OrderModalContext;
  public quantity: string = '1';
  public vendor: any = {id: "", vendor_id: ""};
  public location: string = '';
  public valid: boolean = false;
  public isAuto: boolean = true;
  public unit_type: string ='item';
  public last_unit_type: string ='item';
  
  constructor(
    public dialog: DialogRef<Add2OrderModalContext>,
    public cartService: CartService,
    public toasterService: ToasterService,
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }
  
  //The calculation should be based on package, units and sub-units data from the api. Also if i enter in
  // 20 sleeves and there are 10 sleeves per package it should only add 2 items to the shopping list and not 20.
  // If the user enters in a partial package it should round up to the nearest whole package quantity.
  
  ngOnInit() {
    console.log('CONTEXT',this.context);
    let e = this.context.data.selectedVendor ? this.context.data.selectedVendor : '';
    this.vendorChange({target: {value: e}});
    console.log(this.context.data);
    this.quantity = this.context.data['quantity'];
    this.location = this.context.data.locationArr[0]['id'];
    this.validateFields();
  }
  
  dismissModal() {
    this.dialog.dismiss();
  }
  
  closeModal(data) {
    this.dialog.close(data);
  }
  
  validateFields() {
    // there's nothing to check now
    this.valid = true;
    return this.valid;
  }
  
  parseInt(a) {
    return parseInt(a)
  }
  
  changeUnitType(){
    let perPackage = this.context.data.units_per_package ? this.context.data.units_per_package : 1;
    let perSleeve = this.context.data.sub_unit_per_package ? this.context.data.sub_unit_per_package : 1;
    
    let a:any;
    switch (this.last_unit_type) {
      case 'item':
        switch (this.unit_type) {
          case 'sleeves':
            a=Math.round(parseInt(this.quantity)/perSleeve);
            this.quantity = a.toString();
            break;
          case 'package':
            this.quantity=Math.round(parseInt(this.quantity)/perPackage/perSleeve).toString();
            break;
        }
        break;
      case 'sleeves':
        switch (this.unit_type) {
          case 'item':
            this.quantity=Math.round(parseInt(this.quantity)*perSleeve).toString();
            break;
          case 'package':
            this.quantity=Math.round(parseInt(this.quantity)/perPackage).toString();
            break;
        }
        break;
      case 'package':
        switch (this.unit_type) {
          case 'item':
            this.quantity=Math.round(parseInt(this.quantity)*perPackage*perSleeve).toString();
            break;
          case 'sleeves':
            this.quantity=Math.round(parseInt(this.quantity)*perPackage).toString();
            break;
        }
        break;
    }
    this.last_unit_type = this.unit_type;
  }
  
  saveOrder() {
    if (this.validateFields()) {
      let data = {
        "location_id": this.location,
        "product_id": this.context.data.productId,
        "variants": [
          {
            "vendor_id": this.vendor.vendor_id,
            "variant_id": this.vendor.variant_id,
            "vendor_variant_id": this.vendor.variant_id,
            "qty": parseInt(this.quantity),
            "unit_type":this.unit_type,
            "vendor_auto_select": this.isAuto,
          }
        ]
      };
      
      this.cartService.addToCart(data)
      .subscribe(() => {
        this.toasterService.pop("", this.vendor.name + " successfully added to the shopping list");
        this.dismissModal();
      }, (e) => console.log(e));
    }
  }
  
  vendorChange($event) {
    if ($event.target.value == '') {
      this.isAuto = true;
      this.vendor = _.cloneDeep(this.context.data.vendorArr[0]);
      this.vendor.vendor_id = '';
    } else {
      this.isAuto = false;
      this.vendor = _.cloneDeep(this.context.data.vendorArr.find((v: any) => (v.vendor_id == $event.target.value)));
    }
  }
}
