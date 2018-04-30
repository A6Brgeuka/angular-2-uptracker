import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {NewVendorModel} from '../../../models/new-vendor.model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {InventoryService} from '../../../core/services/inventory.service';
import {DestroySubscribers} from 'ngx-destroy-subscribers';
import {Observable} from 'rxjs/Observable';

import {isObject} from 'lodash';
import {VendorService} from "../../../core/services/vendor.service";

@Component({
  selector: 'app-vendor-search',
  templateUrl: './vendor-search.component.html',
  styleUrls: ['vendor-search.component.scss']
})
@DestroySubscribers()
export class VendorSearchComponent implements OnInit {

  @Output('vendorChosen') vendorChosen = new EventEmitter();

  public subscribers: any = {};
  public vendor = {vendor_name:null, vendor_id:null};
  public vendorDirty: boolean = false;
  public vendorValid: boolean = false;
  public vendorModel: NewVendorModel;
  public autocompleteVendors$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public autocompleteVendors: any = [];

  constructor(private inventoryService: InventoryService,
              private vendorService: VendorService) {
  }

  addSubscribers() {
    this.subscribers.autocompleteVendorsSubscription = this.autocompleteVendors$
      .switchMap((key: string) => this.inventoryService.autocompleteSearchVendor(key)).publishReplay(1).refCount()
      .subscribe((vendors: any) => this.autocompleteVendors = vendors);
  }

  observableSourceVendor(keyword: any) {
    return Observable.of(this.autocompleteVendors).take(1);
  }

  onSearchVendor(event) {
    this.vendorDirty = true;
    this.vendorValid = !!(event.target.value);
    this.vendorService.vendorSearch = event.target.value;
    this.autocompleteVendors$.next(event.target.value);
  }

  selectedAutocompleteVendor(vendor) {
    if (!(this.vendor && !vendor.vendor_id && this.vendor.vendor_name === vendor)) {
      this.vendor = (vendor.vendor_id) ? vendor : {vendor_name: vendor, vendor_id: null};
    }
    if (isObject(vendor)) {
      this.vendorChosen.emit(vendor);
    }
  }

  ngOnInit() {
  }

}
