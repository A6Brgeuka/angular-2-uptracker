import {Component, OnInit} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Modal} from 'angular2-modal';
import { DestroySubscribers } from 'ngx-destroy-subscribers';

import {each, map, every, difference, findIndex, flatten} from 'lodash';
import {AccountService} from '../../../core/services/account.service';
import {ModalWindowService} from '../../../core/services/modal-window.service';
import {ProductService} from '../../../core/services/product.service';
import {HelpTextModal} from '../../inventory/add-inventory/help-text-modal/help-text-modal-component';
import { Location } from '@angular/common';
import {CustomProductModel, CustomProductVariantModel} from '../../../models/custom-product.model';
import {ProductVariantsModel} from '../../../models/product-variants.model';
import {PackageModel, inventoryExample} from '../../../models/inventory.model';
import {ToasterService} from '../../../core/services/toaster.service';
import {Router} from '@angular/router';
import {AddVendorModalComponent} from "../../../shared/modals/add-vendor-modal/add-vendor-modal.component";

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
  public vendorVariants: any = [];
  public step: number = 0;
  public vendors: any[] = [];
  public departmentCollection$: Observable<any> = new Observable<any>();
  public departmentCollection: any[];
  public productAccountingCollection$: Observable<any> = new Observable<any>();
  public productAccountingCollection: any[];
  public productCategoriesCollection$: Observable<any> = new Observable<any>();
  public productCategoriesCollection: any[];
  public newVariant: string = '';
  public logo: any;
  public logoPreview: string = null;
  public dummyProductVariants = ["Size", "Color", "Texture", "Grit", "Length", "Strength", "Prescription", "Type"];
  public productVariants: ProductVariantsModel[] = [
    {
      name: 'Size',
      values: ['Small', 'Medium', 'Large'],
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
    private router: Router
  ) {
  }

  ngOnInit() {
    this.product.name = this.product.proper_name = this.productService.searchText;
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
  }

  onNextClick() {
    this.step++;
    if (this.step == 2) {
      this.updateVendorProducts();
    }
  }

  createVendorVariants() {
    let arr = map(this.productVariants, 'values');
    if (!arr.length) return [{...new CustomProductVariantModel(), name: this.product.name}];
    return this.productService.recursive(...arr);
  }

  setPropName = (name) => this.product.proper_name = name;

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

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    let files: File[] = inputValue.files;
    this.addFile(files);
  }

  onFileDrop(file: any): void {
    let myReader: any = new FileReader();
    myReader.fileName = file.name;
    this.addFile(file);
  }

  addFile(files) {
    const formData = new FormData();
    each(files, (file, i) => formData.append(`documents[${i}]`, file));
    this.productService.addCustomProductDocument(formData)
      .subscribe(urls =>
        this.product.attachments = this.product.attachments.concat(urls))
  }

  removeFile(i) {
    this.product.attachments.splice(i, 1)
  }

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

  onProductVariantSelect = (name) => {
    if (!name) return;
    this.productVariants.push(new ProductVariantsModel({name}));
    this.newVariant = '';
  };

  goBack = (): void => this.location.back();

  onSubmit() {
    const product = this.formatProduct(this.product);
    this.productService.addCustomProduct(product)
      .subscribe((product) => {
        this.toasterService.pop('', 'Product successfully added');
        this.productService.addToCollection$.next([product]);
        this.router.navigate(['/products']);
      });
  }

  canProceed() {
    if (this.step == 0) {
      return this.product.name && this.product.category;
    }
    if (this.step == 1) {
      return this.validVariants();
    }
  }

  get availableVariants() {
    return difference(this.dummyProductVariants, map(this.productVariants, 'name'));
  }

  validVariants() {
    return every(this.productVariants, p => p.name && p.values.length > 0);
  }

  productNotValid() {
    return this.vendorVariants.length < 1;
  }

  onVendorChosen(vendorInfo) {
    const vendor = this.createVendor(vendorInfo);
    const i = findIndex(this.vendorVariants, (arr) => arr[0].vendor_name == vendor['vendor_name']);
    i > -1 ? this.vendorVariants[i].unshift(vendor) : this.vendorVariants.unshift([vendor]);
  }

  onVendorDelete(i) {
    this.vendorVariants.splice(i, 1);
  }

  formatProduct(product) {
    const attachments = map(product.attachments, 'public_url');
    const vendor_variants = flatten(this.vendorVariants);
    return {...product, vendor_variants, attachments};
  }

  createVendor(vendorInfo) {
    const variants = this.createVendorVariants();
    const inventory_by = [map(inventoryExample, (inv) => new PackageModel(inv))];
    return {...vendorInfo, inventory_by, variants}
  }

  updateVendorProducts() {
    each(this.vendorVariants, vendors =>
      map(vendors, v => v['variants'] = this.createVendorVariants()));
  }

  openAddVendorsModal() {
    this.modal
      .open(AddVendorModalComponent, this.modalWindowService.overlayConfigFactoryWithParams({modalMode: true}, true))
      .then((resultPromise) => {
        resultPromise.result.then(
          (vendor) => {
            this.onVendorChosen({vendor_name: vendor.name});
          },
          (err) => {
          }
        );
      });
  }
}
