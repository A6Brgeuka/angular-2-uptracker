import { Component, OnInit, Input } from '@angular/core';
import { ProductModel } from '../../../../models/product.model';
import { ProductService } from '../../../../core/services/product.service';
import {HelpTextModal} from "../../../../dashboard/inventory/add-inventory/help-text-modal/help-text-modal-component";
import {DialogRef, Modal} from "angular2-modal";
import {ModalWindowService} from "../../../../core/services/modal-window.service";

@Component({
  selector: 'app-add-product-from-vendor-step1',
  templateUrl: 'add-product-from-vendor-step1.component.html',
  styleUrls: ['add-product-from-vendor-step1.component.scss']
})
export class AddProductFromVendorStep1Component implements OnInit {

  @Input('product') product: ProductModel;
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

  constructor(
    private productService: ProductService,
    public modal: Modal,
    public modalWindowService: ModalWindowService) {
  }

  ngOnInit() {
  }

  openHelperModal() {
    this.modal.open(HelpTextModal, this.modalWindowService
      .overlayConfigFactoryWithParams({"text": ''}, true, 'mid'))
  }
}
