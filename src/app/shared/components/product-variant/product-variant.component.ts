import {Component, Input, Output, EventEmitter} from '@angular/core';
import {each} from 'lodash';

@Component({
  selector: 'app-product-variant',
  templateUrl: 'product-variant.component.html',
  styleUrls: ['product-variant.component.scss']
})

export class ProductVariantComponent {
  @Input('vendor') public vendor;
  @Output('vendorDelete') public vendorDelete = new EventEmitter();
  @Output('addVendor') public addVendor = new EventEmitter();

  public selected: any = {};

  constructor() {
  }

  deletePackage(i) {
    this.vendor.inventory_by.splice(i, 1);
    if (!this.vendor.inventory_by.length) {
      this.vendorDelete.emit();
    }
  }

  selectAll() {
    each(this.vendor.variants, (v) => {
      v.enabled = this.selected.all
    });
  }

  onFillAll(price) {
    each(this.vendor.variants, v => {
      v.list_price = v.our_price = price;
    });
  }

  onFillColumn(price) {
    each(this.vendor.variants, v => v[price.prop] = price.value);
  }

  onAddPackageClick() {
    const vendor = {
      vendor_name: this.vendor.vendor_name,
      vendor_id: this.vendor.vendor_id,
      additional: true
    };
    this.addVendor.emit(vendor);
  }

  onFillOur(price, i) {
    this.vendor.variants[i].our_price = price;
  }

}
