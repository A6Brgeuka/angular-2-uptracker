import {
  Component, OnInit, ViewContainerRef, ReflectiveInjector, ComponentRef, Injector,
  Injectable, Renderer
} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import {
  Overlay, overlayConfigFactory, DialogRef, createComponent, ModalOverlay,
  OverlayRenderer, DOMOverlayRenderer
} from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as _ from 'lodash';

import { ViewProductModal } from './view-product-modal/view-product-modal.component';
import { EditProductModal } from './edit-product-modal/edit-product-modal.component';
import { ProductFilterModal } from './product-filter-modal/product-filter-modal.component';
import { RequestProductModal } from './request-product-modal/request-product-modal.component';
import { ProductService } from '../../core/services/index';
import { ModalWindowService } from "../../core/services/modal-window.service";
import { AddProductModal } from "./add-product-modal/add-product-modal.component";
import { ShoppingListSettingsModal } from './shopping-list-settings-modal/shopping-list-settings.component';
import { UserService } from '../../core/services/user.service';
import { CartService } from '../../core/services/cart.service';
import { PriceModal } from './price-modal/price-modal.component';
import { AccountService } from '../../core/services/account.service';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
@DestroySubscribers()
export class ShoppingListComponent implements OnInit {
  public selectAll: string;
  public last_loc:string = '';
  public searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public sortBy: string;
  public sortBy$: BehaviorSubject<any> = new BehaviorSubject(null);
  public cart$: BehaviorSubject<any> = new BehaviorSubject(null);
  public cart:any = [];
  public total: number;
  public orders: any;
  public orders$: BehaviorSubject<any> = new BehaviorSubject({});
  public products: any = [];
  public changes$: BehaviorSubject<any>[] = [];
  public changed: any = [];
  public selectedProducts: any = [];
  
  constructor(
    public modal: Modal,
    public productService: ProductService,
    public modalWindowService: ModalWindowService,
    public userService: UserService,
    public cartService: CartService,
    public accountService: AccountService,
  ) {
  }
  
  ngOnInit() {
//TODO remove
    this.accountService.dashboardLocation$.next(this.accountService.dashboardLocation);

    this.cartService.collection$.subscribe((r: any) => {
      this.total = r.length;
      this.cart$.next(r);
      this.changed = [];
    });

    //this.changePriceModal();
  }
  
  selectOrder(id) {
  }
  
  
  viewProductModal(product) {
    this.modal
    .open(ViewProductModal, this.modalWindowService.overlayConfigFactoryWithParams({product: product}))
    .then((resultPromise) => {
      resultPromise.result.then(
        (res) => {
          this.editProductModal(res);
        },
        (err) => {
        }
      );
    });
  }
  
  viewSettingsModal() {
    this.modal
    .open(ShoppingListSettingsModal, this.modalWindowService.overlayConfigFactoryWithParams({}, true))
    .then((resultPromise) => {
      resultPromise.result.then(
        (res) => {
          this.editProductModal(res);
        },
        (err) => {
        }
      );
    });
  }
  
  addProduct() {
    this.modal
    .open(AddProductModal, this.modalWindowService.overlayConfigFactoryWithParams({}))
    .then((resultPromise) => {
      resultPromise.result.then(
        (res) => {
          this.editProductModal(res);
        },
        (err) => {
        }
      );
    });
  }
  
  editProductModal(product = null) {
    this.modal.open(EditProductModal, this.modalWindowService.overlayConfigFactoryWithParams({product: product}));
  }
  
  searchFilter(event) {
    // replace forbidden characters
    let value = event.target.value.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    this.searchKey$.next(value);
  }
  
  
  showFiltersModal() {
    this.modal
    .open(ProductFilterModal, this.modalWindowService.overlayConfigFactoryWithParams({}, true))
    .then((resultPromise) => {
      resultPromise.result.then(
        (res) => {
          // this.filterProducts();
        },
        (err) => {
        }
      );
    });
  }
  
  changePriceModal(item = {}) {
    //TODO
    this.modal
    .open(PriceModal, this.modalWindowService.overlayConfigFactoryWithParams({"product":item}, true))
    .then((resultPromise) => {
      resultPromise.result.then(
        (res) => {
          // this.filterProducts();
        },
        (err) => {
        }
      );
    });
  }
  
  updateVendor(product, vendor) {
    product.selected_vendor = vendor;
    product.selected_vendor.id = vendor.vendor_id;
    product.selected_vendor.price = vendor.book_price;
    this.changeRow(product);
  }
  
  onCheck() {
  
  }
  
  
  saveItem(item: any = {}) {
    let data = {
      "location_id": this.accountService.dashboardLocation ? this.accountService.dashboardLocation.id :  item.prev_location,
      "product_id": item.product_id,
      "variants": [
        {
          "variant_id": item.variant_id,
          "vendor_variant_id": item.variant_id,
          "qty": item.qty,
          "vendor_auto_select": item.selected_vendor.id ? false : true,
          "location_id": item.location_id,
          "status": item.status ? 1 : 0,
        }
      ]
    };
    item.prev_location = item.location_id;
    if (item.selected_vendor.id) {
      data['variants'][0]['vendor_id']= item.selected_vendor.id;
    }
    this.cartService.updateItem(data)
    .subscribe((r: any) => {
        this.changed[item.id] = false;
        this.accountService.dashboardLocation$.next(this.accountService.dashboardLocation);
      },
      (err: any) => {
        console.error(err);
      });
  };
  
  changeRow(item) {
    this.changed[item['id']] = true;
    this.saveItem(item);
  }
}