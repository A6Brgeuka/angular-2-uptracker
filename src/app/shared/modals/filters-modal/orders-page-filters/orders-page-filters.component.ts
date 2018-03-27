import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import * as _ from 'lodash';

import { VendorService } from '../../../../core/services/vendor.service';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DialogRef, ModalComponent } from 'angular2-modal';

export class OrdersPageFiltersModalContext extends BSModalContext {
  public filters: any;
}

@Component({
  selector: 'app-orders-page-filters',
  templateUrl: './orders-page-filters.component.html',
})
@DestroySubscribers()
export class OrdersPageFiltersComponent implements OnInit, ModalComponent<OrdersPageFiltersModalContext> {
  private subscribers: any = {};
  context;
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
    public dialog: DialogRef<OrdersPageFiltersModalContext>,
    private vendorService: VendorService,
  ) {
    this.context = dialog.context;

    this.filterForm = new FormGroup({
      archived: new FormControl(),
      discounts: new FormControl(),
      vendors: new FormControl(),
      voided: new FormControl(),
      myFavorite: new FormControl(),
      orderedFrom: new FormControl(),
      orderedTo: new FormControl(),
    });

  }
  get archivedControl() {
    return this.filterForm.get('archived');
  }
  get discountsControl() {
    return this.filterForm.get('discounts');
  }
  get voidedControl() {
    return this.filterForm.get('voided');
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

  dismissModal() {
    this.dialog.dismiss();
  }

  applyFilters() {
    console.log(this.filterForm.value, 'Filter Form');
    this.dialog.close(this.filterForm.value);
  }

}
