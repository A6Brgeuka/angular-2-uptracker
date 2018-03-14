import { Component } from '@angular/core';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { FormControl } from '@angular/forms';

import * as _ from 'lodash';

import { VendorService } from '../../../../core/services/vendor.service';

@Component({
  selector: 'app-vendor-filter',
  templateUrl: './vendor-filter.component.html',
})
@DestroySubscribers()
export class VendorFilterComponent {

  public vendors = new FormControl([]);
  public vendorsCollection = {'': null};

  public autocompleteVendors = {
    autocompleteOptions: {
      data: this.vendorsCollection,
      limit: Infinity,
      minLength: 1,
    }
  };

  private subscribers: any = {};

  constructor(
    private vendorService: VendorService,
  ) {
  }

  addSubscribers() {
    this.subscribers.getVendorsSubscription = this.vendorService.getVendors()
    .subscribe((res: any) => {
      const vendorsData = _.flattenDeep(res.data.vendors);
      vendorsData.map((vendor: any) => {
        this.vendorsCollection[vendor.name] = null;
      });
    });
  }

}
