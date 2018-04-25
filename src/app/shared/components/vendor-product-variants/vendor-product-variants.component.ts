import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {AddProductManagerService} from "../../../core/services/add-product-manager.service";
import {isEqual, each, reduce, cloneDeep} from 'lodash';

@Component({
  selector: 'app-vendor-product-variants',
  templateUrl: './vendor-product-variants.component.html',
  styleUrls: ['./vendor-product-variants.component.scss']
})
export class VendorProductVariantsComponent implements OnInit {

  @Input('variants') public variants: any[];
  @Output('addVendor') public addVendor = new EventEmitter();
  @Output('vendorDelete') public vendorDelete = new EventEmitter();

  public vendor: any = {};

  constructor(private productManager: AddProductManagerService) { }

  ngOnInit() {
    this.vendor = {
      vendor_name : this.variants[0].vendor_name,
      vendor_id: this.variants[0].vendor_id
    };

    this.group();
  }

  onAddPackageClick() {
    this.addVendor.emit({...this.vendor, additional: true});//TODO: find a better way (additional)
  }

  onVendorDelete(i) {
    if (this.variants[i].additional) {
      this.productManager.additionalVariantsRemove(this.variants[i]);
    }
    this.variants.splice(i, 1);
    if (!this.variants.length) {
      this.vendorDelete.emit();
    }
  }

  group() {

    each(this.variants, (vendor, i) => {
      const toDelete = [];
      if (!this.variants[i]) return;
      if (vendor.additional) return;
      for (let j=i+1; j<this.variants.length; j++) {
        if (isEqual(this.variants[i].inventory_by[0], this.variants[j].inventory_by[0])) {
          this.variants[i].variants.push(this.variants[j].variants[0]);
          toDelete.push(j);
        }
      }

      for (let j = toDelete.length-1; j>=0; j--) {
        this.variants.splice(toDelete[j], 1);
      }
    });
  }

}
