import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard, Modal } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { ProductService } from '../../../../core/services/product.service';

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
  public quantity: number = 1;
  public vendor: any= {id:"", vendor_id:""};
  public location: string = '';
  public valid1: boolean = false;
  public valid2: boolean = false;
  public valid3: boolean = false;
  public valid: boolean = false;
  public isAuto: boolean =true;
  
  
  constructor(
    public dialog: DialogRef<Add2OrderModalContext>,
    public productService: ProductService,
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }
  
  ngOnInit() {
    this.vendor = this.context.data
      .vendorArr[0];
    
    console.log(this.context.data);
    this.quantity = this.context.data['quantity'];
    this.location = this.context.data.locationArr[0]['id'];
    if (this.context.data.selectedVariant && this.context.data.selectedVariant.id) {
    
    } else {
      this.vendor = this.context.data.vendorArr[0];
    }
    this.validateFields();
  }
  
  dismissModal() {
    this.dialog.dismiss();
  }
  
  closeModal(data) {
    this.dialog.close(data);
  }
  
  validateFields(){
    this.valid1 = this.quantity > 0;
    this.valid2 = (this.vendor && this.vendor.id) ? true : false;
    this.valid3 = this.location ? true : false;
    this.valid = (this.valid1 && this.valid2 && this.valid3);
    return this.valid;
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
            "qty": this.quantity,
            "vendor_auto_select": this.isAuto,
          }
        ]
      };
      
      this.productService.sendOrder(data)
      .subscribe(() => this.dismissModal(), (e) => console.log(e));
    }
  }
  
  vendorChange($event){
    if ($event.target.value == 'auto') {
      this.isAuto = true;
      this.vendor = this.context.data
        .vendorArr[0];
      this.vendor.id = '';
    } else {
      this.isAuto = false;
      this.vendor = this.context.data
      .vendorArr
      .find((v: any) => (v.id == $event.target.value))
    }
  }
}
