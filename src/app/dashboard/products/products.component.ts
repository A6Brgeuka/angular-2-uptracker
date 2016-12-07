import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as _ from 'lodash';

import { ViewProductModal } from './view-product-modal/view-product-modal.component';
import { EditProductModal } from './edit-product-modal/edit-product-modal.component';
// import { VendorService } from '../../core/services/index';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
@DestroySubscribers()
export class ProductsComponent implements OnInit {
  private searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public sortBy: string;
  private sortBy$: BehaviorSubject<any> = new BehaviorSubject(null);
  public total: number;
  public products$: Observable<any>;

  constructor(
      vcRef: ViewContainerRef,
      overlay: Overlay,
      public modal: Modal,
      // private vendorService: VendorService
  ) {
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
    this.products$ = Observable.of([
      { name: 'First', variations: 3, priceMin: 79, priceMax: 112},
      { name: 'Second with long name length for two lines', variations: 100, priceMin: 8, priceMax: 34},
    ]);
    // this.vendors$ = Observable
    //     .combineLatest(
    //         // this.vendorService.combinedVendors$,
    //         this.sortBy$,
    //         this.searchKey$
    //     )
    //     .map(([vendors, sortBy, searchKey]) => {  
    //       this.total = vendors.length;
    //       let filteredVendors = vendors;
    //       if (searchKey && searchKey!='') {
    //         filteredVendors = _.reject(filteredVendors, (vendor: any) =>{
    //           let key = new RegExp(searchKey, 'i');
    //           return !key.test(vendor.name);
    //         });
    //       }
    //       let order = 'desc';
    //       if (sortBy == 'A-Z') {
    //         sortBy = 'name';
    //         order = 'asc';
    //       }
    //       if (sortBy == 'Z-A') {
    //         sortBy = 'name';
    //       }
    //      
    //       let sortedVendors = _.orderBy(filteredVendors, [sortBy], [order]);
    //       return sortedVendors;
    //     });
  }

  viewProductModal(product){
    this.modal
        .open(ViewProductModal,  overlayConfigFactory({ product: product }, BSModalContext))
        .then((resultPromise)=>{
          resultPromise.result.then(
              (res) => {
                this.editProductModal(res);
              },
              (err)=>{}
          );
        });
  }

  editProductModal(product = null){
    this.modal.open(EditProductModal,  overlayConfigFactory({ product: product }, BSModalContext));
  }

  searchFilter(event){
    // replace forbidden characters
    let value = event.target.value.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    this.searchKey$.next(value);
  }

  itemsSort(event) {
    let value = event.target.value;
    this.sortBy$.next(value);
  }

  showFiltersModal(){
    this.modal
        .open(Modal,  overlayConfigFactory({}, BSModalContext))
        .then((resultPromise)=>{
          resultPromise.result.then(
              (res) => {
                // this.filterProducts();
              },
              (err)=>{}
          );
        });
  }

  requestProduct(){
  }
}
