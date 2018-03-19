import { Component, OnInit } from '@angular/core';
import {ProductModel} from "../../../../models/product.model";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";
import {ProductService} from "../../../../core/services/product.service";
import {DialogRef} from "angular2-modal";

export class AddProductFromVendorModalContext extends BSModalContext {
  product: ProductModel;
}

@Component({
  selector: 'app-add-product-from-vendor',
  templateUrl: 'add-product-from-vendor.component.html',
  styleUrls: ['add-product-from-vendor.component.scss']
})
export class AddProductFromVendorModalComponent implements OnInit {

  public step: number = 1;
  public product: ProductModel;

  constructor(
    public productService: ProductService,
    public dialog: DialogRef<AddProductFromVendorModalContext>
  ) {
    dialog.setCloseGuard(this);
  }

  stepAction = (step) => this.step += step;
  checkStep = (step) => this.step == step;

  save() {
    this.productService.addCustomProduct(this.product);
  }

  ngOnInit() {
    this.product = this.dialog.context.product;
  }

  dismissModal() {
    this.dialog.dismiss();
  }

}
