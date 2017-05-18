import { Component, OnInit, ViewContainerRef, HostListener } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as _ from 'lodash';

import { ViewProductModal } from './view-product-modal/view-product-modal.component';
import { EditProductModal } from './edit-product-modal/edit-product-modal.component';
import { BulkEditModal } from './bulk-edit-modal/bulk-edit-modal.component';
import { ProductFilterModal } from './product-filter-modal/product-filter-modal.component';
import { RequestProductModal } from './request-product-modal/request-product-modal.component';
import { ProductService } from '../../core/services/index';
import { ModalWindowService } from "../../core/services/modal-window.service";
import { AccountService } from "../../core/services/account.service";
import { UploadCsvModal } from './upload-csv-modal/upload-csv-modal.component';
import { ToasterService } from '../../core/services/toaster.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
@DestroySubscribers()
export class ProductsComponent implements OnInit {
  public nothingChecked: boolean;
  public searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public sortBy: string = 'A-Z';
  public sortBy$: BehaviorSubject<any> = new BehaviorSubject('A-Z');
  public total: number;
  public products$: Observable<any>;
  public products: any = [];
  public selectedProducts: any = [];
  
  public dashboardLocation;
  public infiniteScroll$: any = new BehaviorSubject(false);
  public selectAll$: any = new BehaviorSubject(0);
  public isRequest: boolean = false;
  public searchKey: string;
  public searchKeyLast: string;
  public locationId: string;
  public selectAll: boolean = false;
  private subscribers: any;
  
  constructor(
    public modal: Modal,
    public productService: ProductService,
    public modalWindowService: ModalWindowService,
    public accountService: AccountService,
    public toasterService: ToasterService
  ) {
  }
  
  toggleView() {
    this.productService.isGrid = !this.productService.isGrid;
    
  }
  
  toggleSelectAll(event) {
    // 0 = unused, 1 = selectAll, 2 = deselectAll
    this.selectAll$.next(event ? 1 : 2);
    this.onCheck();
  }
  
  ngOnInit() {
    this.accountService.dashboardLocation$.subscribe((loc: any) => {
      this.locationId = loc ? loc['id'] : '';
    });
    
    this.productService.totalCount$.subscribe(total => this.total = total);
    
    this.productService.isDataLoaded$
    .filter(r => r)
    .subscribe((r) => {
      this.isRequest = false;
      this.getInfiniteScroll();
    });
    
    this.searchKey$.debounceTime(1000)
    .filter(r => (r || r === ''))
    .subscribe(
      (r) => {
        this.searchKey = r;
        this.productService.current_page = 0;
        this.productService.getNextProducts(0, r, this.sortBy).subscribe((r) => {
            this.getInfiniteScroll();
          }
        );
      }
    );
  
  
    this.searchKey$
    .subscribe(
      (r) => {
        if (r && this.sortBy=="A-Z") {
          this.sortBy$.next("relevance");
        } else if (!r && this.sortBy === "relevance") {
          this.sortBy$.next("A-Z");
        }
      });
  
    this.sortBy$.subscribe((sb:string)=>{this.sortBy = sb;});
    
    this.sortBy$
    .filter(r => r)
    .subscribe(
      (r) => {
        this.productService.getNextProducts(this.productService.current_page, this.searchKey, r);
        this.productService.current_page = 2;
      }
    );
    
    this.products$ = Observable
    .combineLatest(
      this.productService.collection$,
      this.sortBy$,
      this.searchKey$,
      this.selectAll$
    )
    .map(([products, sortBy, searchKey, selectAll]: [any, any, any, any]) => {
      for (let p of products) {
        (selectAll === 1) ? p.selected = true : p.selected = false;
      }
      return products;
    });
    
    this.productService.collection$.subscribe(r => this.products = r);
    
    Observable.combineLatest(this.infiniteScroll$, this.products$)
    //.debounceTime(100)
    .filter(([infinite, products]) => {
      return (infinite && !this.isRequest && products.length);
    })
    .switchMap(([infinite, products]) => {
      this.isRequest = true;
      
      this.searchKeyLast = this.searchKey;
      //TODO remove
      if (this.total <= (this.productService.current_page - 1) * this.productService.pagination_limit) {
        this.isRequest = false;
        return Observable.of(false);
      } else {
        if (this.searchKey == this.searchKeyLast) {
          ++this.productService.current_page;
        }
        return this.productService.getNextProducts(this.productService.current_page, this.searchKey, this.sortBy);
      }
    })
    .subscribe(res => {
    }, err => {
    
    });
  }
  
  viewProductModal(product) {
    product = Object.assign(product, {location_id: this.productService.dashboardLocation.id});
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
  
  toggleProductVisibility(product) {
    product.status = !product.status;
    //TODO add save to server
  }
  
  
  editProductModal(product = null) {
    this.modal
    .open(EditProductModal, this.modalWindowService.overlayConfigFactoryWithParams({product: product}));
  }
  
  bulkEditModal() {
    if (!this.nothingChecked) {
      
      this.modal
      .open(BulkEditModal, this.modalWindowService.overlayConfigFactoryWithParams({products: this.selectedProducts}));
    }
  }
  
  searchFilter(event) {
    // replace forbidden characters
    let value = event.target.value.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    this.searchKey$.next(value);
  }
  
  itemsSort(event) {
    let value = event.target.value;
    this.sortBy$.next(value);
  }
  
  showFiltersModal() {
    this.modal
    .open(ProductFilterModal, this.modalWindowService.overlayConfigFactoryWithParams({}))
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
  
  getInfiniteScroll() {
    let toBottom = document.body.scrollHeight - document.body.scrollTop - window.innerHeight;
    // console.log('toBottom',toBottom);
    let scrollBottom = toBottom < 285;
    this.infiniteScroll$.next(scrollBottom);
  }
  
  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    this.getInfiniteScroll();
  }
  
  onCheck() {
    this.selectedProducts = _.cloneDeep(this.products)
    .filter(r => r['selected']);
  }
  
  showUploadDialog() {
    this.modal
    .open(UploadCsvModal, this.modalWindowService.overlayConfigFactoryWithParams({}, true))
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
  
  addToFavorites(e, product) {
    e.stopPropagation();
    this.setFavorite(product, true);
  }
  
  removeFromFavorites(e, product) {
    e.stopPropagation();
    this.setFavorite(product, false);
  }
  
  setFavorite(product, val: boolean) {
    product.favorite = val;
    let updateData: any = {
      location_id: this.locationId,
      product: {
        id: product.id,
        favorite: val
      },
      variants: [],
    };
    let updateProduct$ = this.productService.updateProduct(updateData);
    updateProduct$.subscribe((r) => {
      console.log(r);
      this.toasterService.pop('', val ? 'Added to favorites' : "Removed from favorites");
    })
  }
  
  resetFilters() {
    this.searchKey = '';
    this.sortBy = '';
    this.productService.current_page = 0;
    this.productService.getNextProducts(0, this.searchKey, this.sortBy).subscribe((r) => {
        this.getInfiniteScroll();
      }
    );
  }
}