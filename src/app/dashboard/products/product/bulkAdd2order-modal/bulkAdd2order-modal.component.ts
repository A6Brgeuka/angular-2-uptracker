import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash';

import { DialogRef, ModalComponent, CloseGuard, Modal } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { CartService } from '../../../../core/services/cart.service';
import { ToasterService } from '../../../../core/services/toaster.service';
import { AddToOrderData } from '../product.component';

export class BulkAdd2OrderModalContext extends BSModalContext {
  public data: AddToOrderData[];
}

@Component({
  selector: 'app-change-password-user-modal',
  // TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './bulkAdd2order-modal.component.html',
  styleUrls: ['./bulkAdd2order-modal.component.scss']
})
@DestroySubscribers()
export class BulkAdd2OrderModal implements OnInit, CloseGuard, ModalComponent<BulkAdd2OrderModalContext> {
  context: BulkAdd2OrderModalContext;
  public quantity: string = '1';
  public vendor: any = {id: "", vendor_id: ""};
  public location: string = '';
  public valid: boolean = false;
  public isAuto: boolean = true;
  public unit_type: string ='package';
  public last_unit_type: string ='package';
  public items:AddToOrderData[];
  
  constructor(
    public dialog: DialogRef<BulkAdd2OrderModalContext>,
    public cartService: CartService,
    public toasterService: ToasterService,
  ) {
    this.items = dialog.context.data;
    
    dialog.setCloseGuard(this);
  }
  
  ngOnInit() {
    // TODO
    
    console.log('CONTEXT',this.context);
    //let e = this.context.data.selectedVendor ? this.context.data.selectedVendor : '';
    //this.vendorChange({target: {value: e}});
    //this.quantity = this.context.data['quantity'];
    //this.location = this.context.data.locationArr[0]['id'];
    //this.validateFields();
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
    this.items.map((item:AddToOrderData)=>{
      let perPackage = item.units_per_package ? item.units_per_package : 1;
      let perSleeve = item.sub_unit_per_package ? item.sub_unit_per_package : 1;
      switch (this.last_unit_type) {
        case 'subunit':
          switch (this.unit_type) {
            case 'unit':
              this.quantity = Math.round(parseInt(this.quantity)/perSleeve).toString();
              break;
            case 'package':
              this.quantity=Math.round(parseInt(this.quantity)/perPackage/perSleeve).toString();
              break;
          }
          break;
        case 'unit':
          switch (this.unit_type) {
            case 'subunit':
              this.quantity=Math.round(parseInt(this.quantity)*perSleeve).toString();
              break;
            case 'package':
              this.quantity=Math.round(parseInt(this.quantity)/perPackage).toString();
              break;
          }
          break;
        case 'package':
          switch (this.unit_type) {
            case 'subunit':
              this.quantity=Math.round(parseInt(this.quantity)*perPackage*perSleeve).toString();
              break;
            case 'unit':
              this.quantity=Math.round(parseInt(this.quantity)*perPackage).toString();
              break;
          }
          break;
      }
      this.last_unit_type = this.unit_type;  
    })
    
  }
  
  saveOrder() {
    this.items.map((item:AddToOrderData)=>{
      if (this.validateFields()) {
        let data = {
          "location_id": this.location,
          "product_id": item.productId,
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
    });
  }
  
  vendorChange($event) {
    //if ($event.target.value == '') {
    //  this.isAuto = true;
    //  this.vendor = _.cloneDeep(item.vendorArr[0]);
    //  this.vendor.vendor_id = '';
    //} else {
    //  this.isAuto = false;
    //  this.vendor = _.cloneDeep(item.vendorArr.find((v: any) => (v.vendor_id == $event.target.value)));
    //}
  }
}
