import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

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

  constructor() { }

  ngOnInit() {
    this.vendor = {
      vendor_name : this.variants[0].vendor_name,
      vendor_id: this.variants[0].vendor_id
    }
  }

  onAddPackageClick() {
    this.addVendor.emit({...this.vendor, additional: true});//TODO: find a better way (additional)
  }

  onVendorDelete(i) {
    this.variants.splice(i, 1);
    if (!this.variants.length) {
      this.vendorDelete.emit();
    }
  }

}
