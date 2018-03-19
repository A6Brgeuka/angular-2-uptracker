import {Component, OnInit, Input} from '@angular/core';
import {ProductModel} from "../../../../../models/product.model";
import {ProductService} from "../../../../../core/services/product.service";
import {HelpTextModal} from "../../../../../dashboard/inventory/add-inventory/help-text-modal/help-text-modal-component";
import {ModalWindowService} from "../../../../../core/services/modal-window.service";
import {Modal} from "angular2-modal";
import {AddVendorModalComponent} from "../../../add-vendor-modal/add-vendor-modal.component";
import {clone} from 'lodash';

@Component({
  selector: 'app-add-product-from-vendor-step2',
  templateUrl: 'add-product-from-vendor-step2.component.html',
  styleUrls: ['add-product-from-vendor-step2.component.scss']
})
export class AddProductFromVendorStep2Component implements OnInit {

  @Input('product') product: ProductModel;
  public vendor: any = {};
  public vendors: any = [];
  public selectAll: boolean;
  public item: any = {};
  public fillAllModel: any = {};

  //must be product.variants or vendor.variants
  public vendorVariants = [
    {
      name: '3M - Emiteck',
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
      name: 'Henry Schine',
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

  //all variables after this comment are only for test
  public currentVariant = {
    custom_attr: []
  };
  public variationArrs = {
    package_type: ['one', 'two'],
    unit_type: ['one', 'two'],
    units_per_package: ['one', 'two'],
    size: ['one', 'two'],
    material: ['one', 'two'],
    price_range: ['one', 'two']
  };
  public departmentCollection = ['one', 'two'];
  public productCategoriesCollection = ['one', 'two'];
  public productAccountingCollection = ['one', 'two'];

  constructor(
    private productService: ProductService,
    public modal: Modal,
    public modalWindowService: ModalWindowService) {
  }

  ngOnInit() {
  }

  onFillAllClick() {
    this.fillAllModel = clone(this.item);
  }

  openHelperModal() {
    this.modal.open(HelpTextModal, this.modalWindowService
      .overlayConfigFactoryWithParams({"text": ''}, true, 'mid'))
  }

  openAddVendorsModal() {
    this.modal
      .open(AddVendorModalComponent, this.modalWindowService.overlayConfigFactoryWithParams({modalMode: true}, true))
      .then((resultPromise) => resultPromise.result.then((customVendor) => {
        this.onVendorChosen(customVendor);
      }));
  }

  onVendorChosen(customVendor) {
    const vendor = {...this.vendorVariants[0], ...customVendor};
    this.vendorVariants.push(vendor);
  }

}
