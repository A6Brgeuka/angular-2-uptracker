import {
  Component, OnInit
} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as _ from 'lodash';

import { ViewProductModal } from './view-product-modal/view-product-modal.component';
import { EditProductModal } from './edit-product-modal/edit-product-modal.component';
import { ProductFilterModal } from './product-filter-modal/product-filter-modal.component';
import { ModalWindowService } from "../../core/services/modal-window.service";
import { AddProductModal } from "./add-product-modal/add-product-modal.component";
import { ShoppingListSettingsModal } from './shopping-list-settings-modal/shopping-list-settings.component';
import { UserService } from '../../core/services/user.service';
import { CartService } from '../../core/services/cart.service';
import { PriceModal } from './price-modal/price-modal.component';
import { AccountService } from '../../core/services/account.service';
import { SlFilters } from '../../models/slfilters.model';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
@DestroySubscribers()
export class ShoppingListComponent implements OnInit {
  public subscribers: any = {};
  public selectAll: boolean = false;
  public last_loc: string = '';
  public searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public cart$: BehaviorSubject<any> = new BehaviorSubject(null);
  public selectAll$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public deleteChecked$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public selectAllCollection$: Observable<any>;
  public cart: any = [];
  public total: number = 1;
  public products: any = [];
  public changes$: BehaviorSubject<any>[] = [];
  public changed: any = [];
  public selectedProducts: any = [];
  public totalOrders: number;
  
  
  constructor(
    public modal: Modal,
    public modalWindowService: ModalWindowService,
    public userService: UserService,
    public cartService: CartService,
    public accountService: AccountService,
  ) {
  }
  
  ngOnInit() {
    //TODO remove
    this.accountService.dashboardLocation$.next(this.accountService.dashboardLocation);
     
    Observable.combineLatest(
      this.cartService.collection$,
      this.cartService.filters$,
    )
    .subscribe(([r, f]) => {
      let cart = _.filter(r, (item: any) => (
        (f.location == '' || f.location == item.location_name)
        && (f.vendor == '' || f.vendor == item.selected_vendor.vendor_name))
        && (!f.onlymy || this.userService.selfData.id == item.created_by)
      );
      this.totalOrders = cart.filter((item:any)=>item.status).length;
      this.total = cart.length;
      this.updateCart(cart);
      this.changed = [];
    });
    
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
    Observable.combineLatest(
      this.cartService.collection$,
      this.cartService.filters$
    )
    .take(1)
    .subscribe(([cart,filters]) => {
      let vendors = [];
      _.map(cart, (v: any) => {
          vendors.push(v.selected_vendor.vendor_name)
      });
      vendors = _.sortedUniq(vendors.sort());
      this.modal
      .open(ProductFilterModal, this.modalWindowService.overlayConfigFactoryWithParams({
        vendors: vendors,
        currentFilters: filters,
        callback: this.applyFilters.bind(this)
      }, true))
      .then((resultPromise) => {
        resultPromise.result.then(
          (res) => {
            // this.filterProducts();
          },
          (err) => {
          }
        );
      });
    });
  }
  
  changePriceModal(item = {}) {
    //TODO
    this.modal
    .open(PriceModal, this.modalWindowService.overlayConfigFactoryWithParams({"product": item}, true, 'mid'))
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
  
  saveItem(item: any = {}) {
    
    let data = {
      "location_id": this.accountService.dashboardLocation ? this.accountService.dashboardLocation.id : item.prev_location,
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
      data['variants'][0]['vendor_id'] = item.selected_vendor.id;
    }
    this.cartService.updateItem(data)
    .subscribe((res: any) => {
        this.changed[item.id] = false;
        //this.accountService.dashboardLocation$.next(this.accountService.dashboardLocation);
        this.cartService.updateCollection(res.items);
      },
      (err: any) => {
        console.error(err);
      });
  };
  
  changeRow(item) {
    this.changed[item['id']] = true;
    this.saveItem(item);
  }
  
  selectAllFunc(selectAll) {
    this.selectAll$.next(!selectAll);
    this.updateSelectAll();
  }
  
  updateSelectAll() {
    this.selectAllCollection$ = Observable.combineLatest(
      this.cartService.collection$,
      this.selectAll$
    ).take(1);
  
    this.subscribers.selectAllSubscription = this.selectAllCollection$
    .subscribe(([r, select]) => {
      let status = select ? 1 : 0;
      let cart = _.forEach(r, (item: any) => {
        item.status = status;
      });
      this.updateCart(cart);
    });
  }
  
  applyFilters(data: SlFilters) {
    this.cartService.filters$.next(data);
  }
  
  deleteCheckedProducts() {
    //this.subscribers.removeItemsSubscriber = this.deleteChecked$
    //.switchMap(() => {
    //  return this.cartService.collection$
    //  .map(res => _.filter(res, 'status'))
    //  .switchMap(res => this.cartService.removeItems(res)
    //  )
    //})
    //.subscribe((res1:any) => {
    //    //this.updateCart(res1.items);
    //    this.updateOrderPreview([]);
    //    this.totalOrders = 0;
    //    this.accountService.dashboardLocation$.next(this.accountService.dashboardLocation);
    //  },
    //  (err) => console.log(err)
    //)
    let checkedResult = _.filter(this.cart$['_value'], 'status');

    this.subscribers.removeItemsSubscriber =  this.cartService.removeItems(checkedResult)
    .subscribe(res => {
        //this.updateCart(res.items);
        this.updateOrderPreview([]);
        this.totalOrders = 0;
        this.accountService.dashboardLocation$.next(this.accountService.dashboardLocation);
      },
      (err) => console.log(err)
    )
  }
  
  updateCart(data) {
    this.cart$.next(data);
  }
  
  updateOrderPreview(data) {
    this.cartService.ordersPreview$.next(data);
  }
  
}