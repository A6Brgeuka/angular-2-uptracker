import { Component, OnInit } from '@angular/core';
import {ProductModel} from "../../../models/product.model";


@Component({
  selector: 'app-add-product-from-vendor-step2',
  templateUrl: 'add-product-from-vendor-step2.component.html',
  styleUrls: ['add-product-from-vendor-step2.component.scss']
})
export class AddProductFromVendorStep2Component implements OnInit {

  public product: ProductModel = new ProductModel();
  public vendor: any = {};
  public vendors: any = [];
  public selectAll: boolean;
  public item: any = {};
  public variants: any = [{},{}];

  //all variables after this comment are only for test
  currentVariant = {
    custom_attr: []
  };
  variationArrs = {
    package_type: ['one', 'two'],
    unit_type: ['one', 'two'],
    units_per_package: ['one', 'two'],
    size: ['one', 'two'],
    material: ['one', 'two'],
    price_range: ['one', 'two']
  };
  variation={
    ackage_type: ''
  };
  departmentCollection = ['one', 'two'];
  productCategoriesCollection = ['one', 'two'];
  productAccountingCollection = ['one', 'two'];

  constructor() { }

  ngOnInit() {
  }

}
