import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import * as _ from 'lodash';

import { VendorService } from '../../../../core/services/vendor.service';

@Component({
  selector: 'app-orders-page-filters',
  templateUrl: './orders-page-filters.component.html',
})
@DestroySubscribers()
export class OrdersPageFiltersComponent implements OnInit {
  private subscribers: any = {};

  public discounts = ['Bogo', 'Percent Off', 'Rewards Points Used'];

  public filterForm: FormGroup;

  public vendorsCollection = {};
  public autocompleteVendors = {
    autocompleteOptions: {
      data: this.vendorsCollection,
      limit: Infinity,
      minLength: 0,
    }
  };

  constructor(
    private vendorService: VendorService,
  ) {
    this.filterForm = new FormGroup({
      discounts: new FormControl(),
      vendors: new FormControl(),
      myFavorite: new FormControl(),
      orderedFrom: new FormControl(),
      orderedTo: new FormControl(),
    });

  }

  get discountsControl() {
    return this.filterForm.get('discounts');
  }
  get vendorsControl() {
    return this.filterForm.get('vendors');
  }
  get myFavoriteControl() {
    return this.filterForm.get('myFavorite');
  }
  get orderedFromControl() {
    return this.filterForm.get('orderedFrom');
  }
  get orderedToControl() {
    return this.filterForm.get('orderedTo');
  }

  ngOnInit() {
    this.subscribers.getVendorsSubscription = this.vendorService.getVendors()
    .subscribe((res: any) => {
      const vendorsData = _.flattenDeep(res.data.vendors);
      vendorsData.map((vendor: any) => {
        this.vendorsCollection[vendor.name] = null;
      });
    });
  }

}
