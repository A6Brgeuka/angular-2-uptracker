import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import { ProductService } from '../../../core/services/product.service';

export class AddToOrderModalContext extends BSModalContext {
  public data: any;
}

@Component({
  selector: 'app-add-to-order-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  templateUrl: './add-to-order-modal.component.html',
  styleUrls: ['./add-to-order-modal.component.scss']
})

@DestroySubscribers()
export class AddToOrderModal implements OnInit, CloseGuard, ModalComponent<AddToOrderModalContext> {
  context: AddToOrderModalContext;
  private quantity: number = 1;
  private vendor: any= {id:"", vendor_id:""};
  private location: string = '';
  private valid1: boolean = false;
  private valid2: boolean = false;
  private valid3: boolean = false;
  private valid: boolean = false;
  
  
  constructor(
    public dialog: DialogRef<AddToOrderModalContext>,
    public productService: ProductService,
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }
  
  ngOnInit() {
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
            "vendor_id": this.vendor.id,
            "variant_id": this.vendor.variant_id,
            "vendor_variant_id": this.vendor.vendor_id,
            "qty": this.quantity,
            "vendor_auto_select": true
          }
        ]
      };
  
      this.productService.sendOrder(data)
      .subscribe(() => this.dismissModal(), (e) => console.log(e));
    }
  }
  
  vendorChange($event){
    this.vendor = this.context.data
    .vendorArr
    .find((v:any)=>(v.id == $event.target.value))
  }
}
