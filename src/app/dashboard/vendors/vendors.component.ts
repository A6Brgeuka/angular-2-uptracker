import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as _ from 'lodash';

import { ViewVendorModal } from './view-vendor-modal/view-vendor-modal.component';
import { EditVendorModal } from './edit-vendor-modal/edit-vendor-modal.component';
import { VendorService, ModalWindowService } from '../../core/services/index';
import { VendorModel } from '../../models/vendor.model';


@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
@DestroySubscribers()
export class VendorsComponent implements OnInit {
  private searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public sortBy: string;
  private sortBy$: BehaviorSubject<any> = new BehaviorSubject(null);
  public total: number;
  public vendors$: Observable<any>;

  constructor(
      private vcRef: ViewContainerRef,
      overlay: Overlay,
      public modal: Modal,
      private vendorService: VendorService,
      private modalWindowService: ModalWindowService
  ) {
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
    this.vendors$ = Observable
        .combineLatest(
            this.vendorService.combinedVendors$,
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
    let data = { vendor: vendor };
    this.modalWindowService.customModal(this.vcRef, ViewVendorModal, data, this.editVendorModal.bind(this));
  }
  
  editVendorModal(vendor: VendorModel = new VendorModel(null)){
    let accountVendor = vendor.account_vendor;
    accountVendor.vendor_id = vendor.id;

    let data = { vendor: accountVendor };
    this.modalWindowService.customModal(this.vcRef, EditVendorModal, data);
  }

  vendorsFilter(event){
    // replace forbidden characters
    let value = event.target.value.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    this.searchKey$.next(value);
  }

  vendorsSort(event) {
    let value = event.target.value;
    this.sortBy$.next(value);
  }
  
  requestVendor(){
    
  }

}
