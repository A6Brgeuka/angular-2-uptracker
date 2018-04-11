import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Modal} from 'angular2-modal';
import { DestroySubscribers } from 'ngx-destroy-subscribers';

import {some, filter, keys, clone, difference, each} from 'lodash';
import {AccountService} from '../../../core/services/account.service';
import {ModalWindowService} from '../../../core/services/modal-window.service';
import {ProductService} from '../../../core/services/product.service';
import {InventorySearchModalComponent} from '../../inventory/inventory-search-modal/inventory-search-modal.component';
import {AddInventoryModal} from '../../inventory/add-inventory/add-inventory-modal.component';
import {HelpTextModal} from '../../inventory/add-inventory/help-text-modal/help-text-modal-component';
import {AddVendorModalComponent} from '../../../shared/modals/add-vendor-modal/add-vendor-modal.component';
import { Location } from '@angular/common';
import {CustomProductModel} from '../../../models/custom-product.model';
import {ProductAttributesModel} from "../../../models/product-attributes.model";

@Component({
  selector: 'app-add-new-product',
  templateUrl: 'add-new-product.component.html',
  styleUrls: ['add-new-product.component.scss'],
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
  public newProductAttributes: any = {};
  public newAttribute: string = '';
  public formData: FormData = new FormData();
  public logo: any;
  public logoPreview: string = null;

  public dummyVendorVariants = [
    {
      vendor_name: '3M - Emiteck',
      variants: [
        {
          name: 'red',
          catalog_number: '555-125',
          package_type: 'Bag',
          units_per_package: 100,
          sub_package: 'ties',
          sub_package_per_package: 10,
          price: 11,
          price_max: 10,
          price_min: 7,
          book_price: 7,
          club_price: 8,
          your_price: 8
        },
        {
          name: 'blue',
          catalog_number: '555-126',
          package_type: 'Bag',
          units_per_package: 100,
          sub_package: 'ties',
          sub_package_per_package: 10,
          price: 11,
          price_max: 10,
          price_min: 7,
          book_price: 7,
          club_price: 8,
          your_price: 8
        },
        {
          name: 'green',
          catalog_number: '555-127',
          package_type: 'Bag',
          units_per_package: 100,
          sub_package: 'ties',
          sub_package_per_package: 10,
          price: 11,
          price_max: 10,
          price_min: 7,
          book_price: 7,
          club_price: 8,
          your_price: 8
        }
      ]
    },
    {
      vendor_name: 'Henry Schine',
      variants: [
        {
          name: 'blue',
          catalog_number: '333-1251',
          package_type: 'sticks',
          units_per_package: 200,
          sub_package: 'ties',
          sub_package_per_package: 25,
          price: 10,
          price_max: 10,
          price_min: 8,
          book_price: 7,
          club_price: 8,
          your_price: 9
        },
        {
          name: 'red',
          catalog_number: '333-1252',
          package_type: 'sticks',
          units_per_package: 200,
          sub_package: 'ties',
          sub_package_per_package: 25,
          price: 10,
          price_max: 10,
          price_min: 8,
          book_price: 7,
          club_price: 8,
          your_price: 9
        },
        {
          name: 'purple',
          catalog_number: '333-1253',
          package_type: 'sticks',
          units_per_package: 200,
          sub_package: 'ties',
          sub_package_per_package: 25,
          price: 10,
          price_max: 10,
          price_min: 8,
          book_price: 7,
          club_price: 8,
          your_price: 9
        }
      ]
    }

  ];
  public vendorVariants: any = [];

  public productAttributes: ProductAttributesModel[] = [
    {
      name: 'color',
      values: ['green', 'blue', 'navy']
    },
    {
      name: 'size',
      values: ['s', 'm', 'xl']
    }
  ];

  constructor(
    private accountService: AccountService,
    private productService: ProductService,
    private modal: Modal,
    private modalWindowService: ModalWindowService,
    private location: Location,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.vendorVariants = clone(this.dummyVendorVariants);
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

    this.subscribers.obsArrReadySubscription = Observable.combineLatest(
      this.departmentCollection$,
      this.productAccountingCollection$,
      this.productCategoriesCollection$
    )
      .filter(([d, p, c]) => d && p && c)
      .subscribe(() => this.changeDetectorRef.detectChanges())
  }

  stepAction = (step) => this.step += step;
  checkStep = (step) => this.step == step;
  setStep = (step) => this.step = step;

  setTechName = (name) => {
    this.product.technical_name = name
    this.changeDetectorRef.detectChanges();
  }

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
        .subscribe((url) => this.product.image = url);
    };
    reader.readAsDataURL(file.target.files[0]);
  }

  openHelperModal() {
    this.modal.open(HelpTextModal, this.modalWindowService
      .overlayConfigFactoryWithParams({'text': ''}, true, 'mid'));
  }

  openAddInventoryModal() {
    const prod = {
      catalog_number: ['030-090', '030-090'],
      category: 'Lab',
      checked: false,
      consumable_unit: {
        properties: {
          unit_type: 'Discs',
          qty: 10
        }
      },
      department: 'clinic',
      images: [],
      inventory_by: [
        {type: 'Package', label: 'Box', value: 'package', qty: 10},
        {type: 'Sub Package', label: '', value: 'sub_package', qty: null},
        {type: 'Consumable Unit', label: 'Disks', value: 'consumable_unit', qty: 1}
      ],
      name: this.product.name,
      notActive: false,
      package_type: 'Box',
      product_id: null,
      sub_package: {
        properties: {
          qty: null,
          unit_type: ''
        }
      },
      suggest: {
        input: ['Bioplast', '4mm', 'Round', 'Red', 'American Orthodontics', 'Great Lakes Orthodontic']
      },
      tags: ['Red', 'American Orthodontics', 'Great Lakes Orthodontic'],
      ups: '',
      variant_id: null,
      vendors: [
        {vendor_name: 'American Orthodontics', vendor_id: '582f4fdd06e55c3aab564023'},
        {vendor_name: 'Great Lakes Orthodontic', vendor_id: '582f4fdf06e55c3aab564037'}
      ]

    };
    this.modal.open(AddInventoryModal, this.modalWindowService
      .overlayConfigFactoryWithParams({'selectedProduct': {...prod, ...this.product}, 'modalMode': true}, true, 'big'))
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
        this.changeDetectorRef.detectChanges()
      }));
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

  deleteItem = (attribute, i) => {
      attribute.splice(i, 1);
  };

  addAttribute = (attribute) => {
    this.productAttributes.push(attribute);
    this.newProductAttributes = {};
  };

  addSection = (name) => this.variants[name.toLowerCase()] = [];

  get availableAttributes() {
    return difference(keys(this.productAttributes), keys(this.variants));
  }

  onProductAttributeSelect = ($event) => {
    let obj = {name: $event, values: []};
    this.productAttributes.push(obj);
    this.newAttribute = '';
  };

  goBack = (): void => this.location.back();

  onSubmit() {
    this.productService.addCustomProduct(this.product);
  }

  onVendorChosen(customVendor) {
    const vendor = {...this.dummyVendorVariants[0], ...customVendor};
    this.vendorVariants.unshift(vendor);
    let vv = [
      {...customVendor,
        "inventory_by":[
      {"type":"Package", "label":"Case", "value":"package", "qty":1200},
      {"type":"Sub Package", "label":"Box", "value":"sub_package", "qty":"100"},
      {"type":"Consumable Unit", "label":"Glove", "value":"consumable_unit", "qty":1}
    ],
      "variants":[
      {
        "name":"Small Red Item",
        "catalog_number":"123-100",
        "list_price":120,
        "our_price":110,
        "club_price":115,
        "enabled": true
      }
    ]}]
    this.product.attributes = this.productAttributes;
    this.product.vendor_variants = vv;
    console.log(this.product , vv)
  }

  onVendorDelete(i) {
    this.vendorVariants.splice(i, 1);
  }
}
