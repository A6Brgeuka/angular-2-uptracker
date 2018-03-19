import { Component, OnInit, Input } from '@angular/core';
import { ProductModel } from '../../../../../models/product.model';
import { ProductService } from '../../../../../core/services/product.service';
import {HelpTextModal} from "../../../../../dashboard/inventory/add-inventory/help-text-modal/help-text-modal-component";
import {DialogRef, Modal} from "angular2-modal";
import {ModalWindowService} from "../../../../../core/services/modal-window.service";
import {Observable} from "rxjs/Observable";
import {DestroySubscribers} from "ngx-destroy-subscribers";
import {AccountService} from "../../../../../core/services/account.service";

@Component({
  selector: 'app-add-product-from-vendor-step1',
  templateUrl: 'add-product-from-vendor-step1.component.html',
  styleUrls: ['add-product-from-vendor-step1.component.scss']
})

@DestroySubscribers()
export class AddProductFromVendorStep1Component implements OnInit {

  @Input('product') product: ProductModel;

  public subscribers: any = {};
  public vendor: any = {};
  public vendors: any = [];
  public selectAll: boolean;
  public item: any = {};
  public variants: any = [{},{}];
  public departmentCollection$: Observable<any> = new Observable<any>();
  public departmentCollection: any[];
  public productAccountingCollection$: Observable<any> = new Observable<any>();
  public productAccountingCollection: any[];
  public productCategoriesCollection$: Observable<any> = new Observable<any>();
  public productCategoriesCollection: any[];
  public pricingRulesCollection$: Observable<any> = Observable.of(['Rule1', 'Rule2', 'Rule3']);
  public pricingRulesCollection: any [];
  public fileArr: any [] = [];

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

  constructor(
    private accountService: AccountService,
    public modal: Modal,
    public modalWindowService: ModalWindowService) {
  }

  ngOnInit() {
    this.departmentCollection$ = this.accountService.getDepartments().take(1);
    this.productAccountingCollection$ = this.accountService.getProductAccounting().take(1);
    this.productCategoriesCollection$ = this.accountService.getProductCategories().take(1);
  }

  addSubscribers() {
    this.subscribers.departmenCollectiontSubscription = this.departmentCollection$
      .subscribe(departments => this.departmentCollection = departments);

    this.subscribers.productAccountingCollection = this.productAccountingCollection$
      .subscribe(collections => this.productAccountingCollection = collections);

    this.subscribers.productCategoriesCollection = this.productCategoriesCollection$
      .subscribe(productsCat => this.productCategoriesCollection = productsCat);

    this.subscribers.pricingRulesCollection = this.pricingRulesCollection$
      .subscribe(rules => this.pricingRulesCollection = rules);
  }

  openHelperModal() {
    this.modal.open(HelpTextModal, this.modalWindowService
      .overlayConfigFactoryWithParams({"text": ''}, true, 'mid'))
  }

  // upload by input type=file
  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    let file: File = inputValue.files[0];
    this.onFileDrop(file);
  }

  onFileDrop(file: any): void {
    let myReader: any = new FileReader();
    myReader.fileName = file.name;
    this.fileArr.push(file);
  }

}
