import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AccountService } from '../../../../core/services/account.service';
import {DialogRef, Modal} from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';

import {some, filter, keys} from 'lodash';
import {HelpTextModal} from "../../../../dashboard/inventory/add-inventory/help-text-modal/help-text-modal-component";
import {ModalWindowService} from "../../../../core/services/modal-window.service";
import {AddVendorModalComponent} from "../../add-vendor-modal/add-vendor-modal.component";
import {AddInventoryModal} from "../../../../dashboard/inventory/add-inventory/add-inventory-modal.component";
import {InventorySearchModalComponent} from "../../../../dashboard/inventory/inventory-search-modal/inventory-search-modal.component";
import {ProductService} from "../../../../core/services/product.service";

export class AddNewProductModalContext extends BSModalContext {

}

@Component({
  selector: 'app-add-new-product-modal',
  templateUrl: 'add-new-product-modal.component.html',
  styleUrls: ['add-new-product-modal.component.scss']
})
@DestroySubscribers()
export class AddNewProductModalComponent implements OnInit {
  public subscribers: any = {};

  public variants: any = {};
  public product: any = {};
  public step: number = 0;
  public vendors: any[] = [];
  public departmentCollection$: Observable<any> = new Observable<any>();
  public departmentCollection: any[];
  public productAccountingCollection$: Observable<any> = new Observable<any>();
  public productAccountingCollection: any[];
  public productCategoriesCollection$: Observable<any> = new Observable<any>();
  public productCategoriesCollection: any[];
  public pricingRulesCollection$: Observable<any> = Observable.of(['Rule1', 'Rule2', 'Rule3']);
  public pricingRulesCollection: any [];
  public fileArr: any[] = [];

  public productVariants = {
    color: ['green', 'blue', 'navy'],
    size: ['s', 'm', 'xl'],
    length: ['1', '3', '5'],
    strength: ['examlpe1', 'examlpe2', 'examlpe3'],
    texture: ['examlpe1', 'examlpe2', 'examlpe3'],
    prescription: ['examlpe1', 'examlpe2', 'examlpe3'],
    grit: ['examlpe1', 'examlpe2', 'examlpe3'],
    type: ['examlpe1', 'examlpe2', 'examlpe3']
  };

  //dummy values
  public variationArrs = {
    outer_package_type: ['Box', 'two'],
    inner_package: ['Type', 'two'],
    consumable_unit: ['Type', 'two']
  };

  constructor(
    private accountService: AccountService,
    private productService: ProductService,
    public dialog: DialogRef<AddNewProductModalContext>,
    public modal: Modal,
    public modalWindowService: ModalWindowService
  ) {
    dialog.setCloseGuard(this);
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

  stepAction = (step) => this.step += step;
  checkStep = (step) => this.step == step;
  setStep = (step) => this.step = step;

  canProceed() {
    if (this.step == 0) {
      return this.product.name;
    }
    if (this.step == 1) {
      return some(this.variants, (val, key) =>  val);
    }
    return true;
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  getVariants() {
    return filter(keys(this.variants), (key) => this.variants[key]);
  }

  uploadLogo(file: any) {
    const reader = new FileReader();
    reader.onload = ($event: any) => this.product.image = $event.target.result;
    reader.readAsDataURL(file.target.files[0]);
  }

  openAddVendorsModal() {
    this.modal
      .open(AddVendorModalComponent, this.modalWindowService.overlayConfigFactoryWithParams({modalMode: true}, true))
      .then((resultPromise) => resultPromise.result.then((customVendor) => {
        this.vendors.push(customVendor);
      }));
  }

  openHelperModal() {
    this.modal.open(HelpTextModal, this.modalWindowService
      .overlayConfigFactoryWithParams({"text": ''}, true, 'mid'));
  }

  openAddInventoryModal() {
    const prod = {
      catalog_number: ["030-090", "030-090"],
      category: "Lab",
      checked: false,
      consumable_unit: {
        properties: {
          unit_type: "Discs",
          qty: 10
        }
      },
      department: "clinic",
      images: [],
      inventory_by: [
        {type: "Package", label: "Box", value: "package", qty: 10},
        {type: "Sub Package", label: "", value: "sub_package", qty: null},
        {type: "Consumable Unit", label: "Disks", value: "consumable_unit", qty: 1}
      ],
      name: this.product.name,
      notActive: false,
      package_type: "Box",
      product_id: null,
      sub_package: {
        properties: {
          qty: null,
          unit_type: ''
        }
      },
      suggest: {
        input: ["Bioplast", "4mm", "Round", "Red", "American Orthodontics", "Great Lakes Orthodontic"]
      },
      tags: ["Red", "American Orthodontics", "Great Lakes Orthodontic"],
      ups: '',
      variant_id: null,
      vendors: [
        {vendor_name: "American Orthodontics", vendor_id: "582f4fdd06e55c3aab564023"},
        {vendor_name: "Great Lakes Orthodontic", vendor_id: "582f4fdf06e55c3aab564037"}
      ]

    };
    this.modal.open(AddInventoryModal, this.modalWindowService
      .overlayConfigFactoryWithParams({'selectedProduct': this.product, 'modalMode': true}, true, 'big'))
      .then((resultPromise) => resultPromise.result.then((inventory) => {
        this.product.inventory_group = inventory;
        this.setStep(6);
      }));
  }

  openInventorySearchModal() {
    this.modal.open(InventorySearchModalComponent, this.modalWindowService
      .overlayConfigFactoryWithParams({}, true, 'big'))
      .then((resultPromise) => resultPromise.result.then((id) => {
        this.product.inventory_group = id;
        this.setStep(6);
      }));
  }

  onVendorChosen($event) {
    this.vendors.push($event);
  }

  removeVendor(i) {
    this.vendors.splice(i, 1);
  }

  save() {
    this.productService.addCustomProduct(this.product);
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
