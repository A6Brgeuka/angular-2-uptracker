import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Modal} from 'angular2-modal';
import { DestroySubscribers } from 'ngx-destroy-subscribers';

import {filter, keys, difference, times, map, join} from 'lodash';
import {AccountService} from '../../../core/services/account.service';
import {ModalWindowService} from '../../../core/services/modal-window.service';
import {ProductService} from '../../../core/services/product.service';
import {InventorySearchModalComponent} from '../../inventory/inventory-search-modal/inventory-search-modal.component';
import {AddInventoryModal} from '../../inventory/add-inventory/add-inventory-modal.component';
import {HelpTextModal} from '../../inventory/add-inventory/help-text-modal/help-text-modal-component';
import { Location } from '@angular/common';
import {CustomProductModel} from '../../../models/custom-product.model';
import {ProductVariantsModel} from "../../../models/product-variants.model";
import {PackageModel} from "../../../models/inventory.model";
import {ToasterService} from "../../../core/services/toaster.service";

const dummyVariant = {
  catalog_number: '555-125',
  list_price: 7,
  club_price: 8,
  our_price: 8,
  enabled: false
};
const dummyProductVariants = ["size”, “color”, “texture”, “grit”, “length”, “strength”, “prescription”, “type"];
const dummyInventory = [
  {type: 'Package', value: 'package'},
  {type: 'Sub Package', value: 'sub_package'},
  {type: 'Consumable Unit', value: 'consumable_unit'}];

@Component({
  selector: 'app-add-new-product',
  templateUrl: 'add-new-product.component.html',
  styleUrls: ['add-new-product.component.scss']
})
@DestroySubscribers()
export class AddNewProductComponent implements OnInit {
  public subscribers: any = {};

  public variants: any = {};
  public product: CustomProductModel = new CustomProductModel();
  public step: number = 0;
  public vendors: any[] = [];
  public departmentCollection$: Observable<any> = new Observable<any>();
  public departmentCollection: any[];
  public productAccountingCollection$: Observable<any> = new Observable<any>();
  public productAccountingCollection: any[];
  public productCategoriesCollection$: Observable<any> = new Observable<any>();
  public productCategoriesCollection: any[];
  public fileArr: any[] = [];
  public newVariant: string = '';
  public logo: any;
  public logoPreview: string = null;
  public productVariants: ProductVariantsModel[] = [
    {
      name: 'color',
      values: ['green', 'blue', 'navy'],
      newName: ''
    },
    {
      name: 'size',
      values: ['s', 'm', 'xl'],
      newName: ''
    }
  ];

  constructor(
    private accountService: AccountService,
    private productService: ProductService,
    private modal: Modal,
    private modalWindowService: ModalWindowService,
    private location: Location,
    private toasterService: ToasterService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.departmentCollection$ = this.accountService.getDepartments().take(1);
    this.productAccountingCollection$ = this.accountService.getProductAccounting().take(1);
    this.productCategoriesCollection$ = this.accountService.getProductCategories().take(1);
  }

  observableProductVariants(keyword: any) {
    return Observable.of(dummyProductVariants).take(1);
  }
  addSubscribers() {
    this.subscribers.departmenCollectiontSubscription = this.departmentCollection$
      .subscribe(departments => this.departmentCollection = departments);

    this.subscribers.productAccountingCollection = this.productAccountingCollection$
      .subscribe(collections => this.productAccountingCollection = collections);

    this.subscribers.productCategoriesCollection = this.productCategoriesCollection$
      .subscribe(productsCat => this.productCategoriesCollection = productsCat);

    this.subscribers.obsArrReadySubscription = Observable.combineLatest(
      this.departmentCollection$,
      this.productAccountingCollection$,
      this.productCategoriesCollection$
    )
      .filter(([d, p, c]) => d && p && c)
      .subscribe(() => this.changeDetectorRef.detectChanges())
  }

  createVendorVariants() {
    let arr = map(this.productVariants, 'values');
    let newVar = (arr) => {
      return {...dummyVariant, name: join(arr, ' ')}
    };
    function recursive() {
      var r = [], arg = arguments, max = arg.length-1;
      function helper(arr, i) {
        for (var j=0, l=arg[i].length; j<l; j++) {
          var a = arr.slice(0); // clone arr
          a.push(arg[i][j]);
          if (i==max)
            r.push(newVar(a));
          else
            helper(a, i+1);
        }
      }
      helper([], 0);
      return r;
    }

    return recursive(...arr);
  }

  stepAction = (step) => this.step += step;
  checkStep = (step) => this.step == step;

  setTechName = (name) => {
    this.product.technical_name = name;
    this.changeDetectorRef.detectChanges();
  };

  canProceed() {
    if (this.step == 0) {
      return this.product.name;
    }
    return true;
  }

  getVariants() {
    return filter(keys(this.variants), (key) => this.variants[key]);
  }

  uploadLogo(file: any) {
    const reader = new FileReader();
    const formData = new FormData();
    reader.onload = ($event: any) => {
      this.logoPreview = $event.target.result;
      formData.append('image', file.target.files[0]);
      this.productService.addCustomProductImage(formData)
        .subscribe(url => this.product.image = url);
    };
    reader.readAsDataURL(file.target.files[0]);
  }

  openHelperModal() {
    this.modal.open(HelpTextModal, this.modalWindowService
      .overlayConfigFactoryWithParams({'text': ''}, true, 'mid'));
  }

  openAddInventoryModal() {
    this.modal.open(AddInventoryModal, this.modalWindowService
      .overlayConfigFactoryWithParams({'selectedProduct': this.product, 'modalMode': true}, true, 'big'))
      .then((resultPromise) =>
        resultPromise.result.then((inventory) =>
          this.product.inventory_group = inventory));
  }

  openInventorySearchModal() {
    this.modal.open(InventorySearchModalComponent, this.modalWindowService
      .overlayConfigFactoryWithParams({}, true, 'big'))
      .then((resultPromise) =>
        resultPromise.result.then((id) =>
          this.product.inventory_group = id));
  }

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

  trackByIndex = (i: number, obj: any) => i;

  deleteItem = (variant, i) => {
      variant.splice(i, 1);
  };

  deleteVariant = (i) => {
    this.productVariants.splice(i, 1);
  };

  addVariant = (variant, i) => {
    if (!variant) return;
    this.productVariants[i].values.push(variant);
    this.productVariants[i].newName = '';
  };

  addSection = (name) => this.variants[name.toLowerCase()] = [];

  get availableVariants() {
    return difference(keys(this.productVariants), keys(this.variants));
  }

  onProductVariantSelect = (name) => {
    if (!name) return;
    this.productVariants.push(new ProductVariantsModel({name}));
    this.newVariant = '';
  };

  goBack = (): void => this.location.back();

  onSubmit() {
    this.productService.addCustomProduct(this.product)
      .subscribe((res) => {
        this.step++;
        this.toasterService.pop('', 'Product successfully added');
      });
  }

  onVendorChosen(customVendor) {
    const variants = this.createVendorVariants();
    const inventory_by = [map(dummyInventory, (inv) => new PackageModel(inv))];
    const vendor = {...customVendor, inventory_by, variants};
    this.product.vendor_variants.unshift(vendor);
  }

  onVendorDelete(i) {
    this.product.vendor_variants.splice(i, 1);
  }
}
