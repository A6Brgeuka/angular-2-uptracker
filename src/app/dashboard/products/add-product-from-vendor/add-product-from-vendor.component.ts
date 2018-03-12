import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-product-from-vendor',
  templateUrl: './add-product-from-vendor.component.html',
  styleUrls: ['add-product-from-vendor.component.scss']
})
export class AddProductFromVendorComponent implements OnInit {

  public product: any = {};
  public vendor: any = {};
  public vendors: any = [];
  public selectAll: boolean;
  public item: any = {};
  public variants: any = [{}, {}];

  constructor() { }

  ngOnInit() {
  }

}
