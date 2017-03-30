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


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
@DestroySubscribers()
export class ShoppingListComponent implements OnInit {
  private searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public sortBy: string;
  private sortBy$: BehaviorSubject<any> = new BehaviorSubject(null);
  private order$: BehaviorSubject<any> = new BehaviorSubject(null);
  public total: number;
  public orders:any;
  public orders$: BehaviorSubject<any> = new BehaviorSubject({});
  public products: any = [];
  public selectedProducts: any = [];
  private currentOrder: string;
  private currentOrder$: BehaviorSubject<any> = new BehaviorSubject(null);
  
  constructor(
    public modal: Modal,
    private productService: ProductService,
    private modalWindowService: ModalWindowService,
  ) {
  }
  
  ngOnInit() {
  
  
  
    this.orders =
      [
        {
          'name': "Uptracker Optimized",
          'id': ";fjdlgefjhjfodjofho",
          'total': 500,
          'products': [
            {
              'name': 'First',
              'selectedVendor': "yegiuyriuyuiyreyuioge",
              'quantity':1,
              'vendors': [
                {'id': "yegiuyriuyuiyreyuioge", 'name': 'Best Vendor', 'price': 99.0},
                {'id': "yegiuyriup;gkfdkgkioe", 'name': 'Mid Vendor', 'price': 139.0},
                {'id': ";kfkgfkhkpfkfhpfhfdhg", 'name': 'Worst Vendor', 'price': 199.0},
              ]
            },
            {
              'name': 'Second',
              'selectedVendor': ";kfkgfkhkpfkfhpfhfdhg",
              'quantity':3,
              'vendors': [
                {'id': "yegiuyriuyuiyreyuioge", 'name': 'Best Vendor', 'price': 99.0},
                {'id': "yegiuyriup;gkfdkgkioe", 'name': 'Mid Vendor', 'price': 139.0},
                {'id': ";kfkgfkhkpfkfhpfhfdhg", 'name': 'Worst Vendor', 'price': 199.0},
              ]
            }
          ]
        },
        {
          'name': "Best Price",
          'id': ";fjdlgefjhjfodjofh3",
          'total': 100500,
          'products': [{
            'name': 'Third',
            'selectedVendor': "yegiuyriup;gkfdkgkioe",
            'quantity':1,
            'vendors': [
              {'id': "yegiuyriuyuiyreyuioge", 'name': 'Best Vendor', 'price': 66.0},
              {'id': "yegiuyriup;gkfdkgkioe", 'name': 'Mid Vendor', 'price': 159.0},
              {'id': ";kfkgfkhkpfkfhpfhfdhg", 'name': 'Worst Vendor', 'price': 499.0},
            ]
          },
            {
              'name': 'Fourth ',
              'quantity':1,
              'selectedVendor': ";kfkgfkhkpfkfhpfhfdhg",
              'vendors': [
                {'id': "yegiuyriuyuiyreyuioge", 'name': 'Best Vendor', 'price': 21.0},
                {'id': "yegiuyriup;gkfdkgkioe", 'name': 'Mid Vendor', 'price': 356.0},
                {'id': ";kfkgfkhkpfkfhpfhfdhg", 'name': 'Worst Vendor', 'price': 546.0},
              ]
            },
            {
              'name': '5th',
              'quantity':1,
              'selectedVendor': ";yegiuyriuyuiycreyuioge",
              'vendors': [
                {'id': "yegiuyriuyuiycreyuioge", 'name': 'Best Vendor', 'price': 241.0},
                {'id': "yegiuyriup;gkfdckgkioe", 'name': 'Mid Vendor', 'price': 3562.15},
                {'id': ";kfkgfckhkpfkfhpfhfdhg", 'name': 'Worst Vendor', 'price': 5464.0},
              ]
            }
          ]
        }
      ];
  
    this.orders$.next(this.orders);
    this.order$.next(this.orders[0]);
    
    Observable
    .combineLatest(this.orders$, this.currentOrder$)
    .filter(([orders, current]) => current)
    .map(([orders,current]) => {
      let ord = _.filter(orders,(o:any)=>{return (current == o.id)});
      this.order$.next(ord[0]);
    }).subscribe();
  
  }
  
  selectOrder(id){
    console.log(id);
    this.currentOrder$.next(id);
  }
  
  onVendorChange(p){
    console.log(p);
      let selected_vendor = _.filter(p.vendors, (r:any)=>(r.id == p.selectedVendor));
      p.selectedPrice = selected_vendor['price'];
    console.log(p);
    this.order$.next(p);
    
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
    .open(ShoppingListSettingsModal, this.modalWindowService.overlayConfigFactoryWithParams({},true))
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
  
  requestProduct() {
    this.modal
    .open(RequestProductModal, this.modalWindowService.overlayConfigFactoryWithParams({}))
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
}
