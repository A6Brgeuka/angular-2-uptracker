import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as _ from 'lodash';

import { ViewVendorModal } from './view-vendor-modal/view-vendor-modal.component';
import { EditVendorModal } from './edit-vendor-modal/edit-vendor-modal.component';
import { UserService, AccountService, VendorService } from '../../core/services/index';
import { AccountVendorModel } from '../../models/index';


@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
@DestroySubscribers()
export class VendorsComponent implements OnInit {
  public vendorArr: any = [];
  private subscribers: any = {};
  public searchKey: string = null;
  private searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public sortBy: string;
  private sortBy$: BehaviorSubject<any> = new BehaviorSubject(null);
  public total: number;
  public vendors$: Observable<any>;

  constructor(
      vcRef: ViewContainerRef,
      overlay: Overlay,
      public modal: Modal,
      private userService: UserService,
      private accountService: AccountService,
      private vendorService: VendorService
  ) {
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
    this.vendors$ = Observable
        .combineLatest(
            this.vendorService.combinedVendors$,
            // combinedVendors$,
            this.sortBy$,
            this.searchKey$
        )
        .map(([vendors, sortBy, searchKey]) => {  
          this.total = vendors.length;
          let filteredVendors = vendors;
          if (searchKey && searchKey!='') {
            filteredVendors = _.reject(filteredVendors, (vendor: any) =>{
              let key = new RegExp(searchKey, 'i');
              return !key.test(vendor.name);
            });
          }
          let order = 'desc';
          if (sortBy == 'A-Z') {
            sortBy = 'name';
            order = 'asc';
          }
          if (sortBy == 'Z-A') {
            sortBy = 'name';
          }
          
          let sortedVendors = _.orderBy(filteredVendors, [sortBy], [order]);
          return sortedVendors;
        });
  }

  viewVendorModal(vendor = null){
    this.modal
        .open(ViewVendorModal,  overlayConfigFactory({ vendor: vendor }, BSModalContext))
        .then((resultPromise)=>{
          resultPromise.result.then(
              (res) => {
                this.editVendorModal(res);
              },
              (err)=>{}
          );
        });
  }
  
  editVendorModal(vendor = null){
    let accountVendor = new AccountVendorModel(vendor.account_vendor);
    accountVendor.vendor_id = vendor.id;
    this.modal.open(EditVendorModal,  overlayConfigFactory({ vendor: accountVendor }, BSModalContext));
  }

  vendorsFilter(event){
    let value = event.target.value;
    this.searchKey$.next(value);
  }

  vendorsSort(event) {
    let value = event.target.value;
    this.sortBy$.next(value);
  }
  
  requestVendor(){
    
  }

}
