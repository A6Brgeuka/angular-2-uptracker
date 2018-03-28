import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import * as _ from 'lodash';

import { VendorService } from '../../../../core/services/vendor.service';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { AllOrdersListService } from '../../../../dashboard/orders/services/all-orders-list.service';
import { PastOrderService } from '../../../../core/services/pastOrder.service';
import { OrdersPageFiltersModel } from './orders-page-filters.model';

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
  public vendors$;
  public vendorsData: any[];
  public context;

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
    public pastOrderService: PastOrderService,
    private vendorService: VendorService,
  ) {
    this.context = dialog.context;
    this.vendors$ = this.vendorService.getVendors();

    this.filterForm = new FormGroup({
      archived: new FormControl(),
      bogo: new FormControl(),
      percent_off: new FormControl(),
      rewards: new FormControl(),
      vendorsName: new FormControl(),
      vendors: new FormControl(),
      voided: new FormControl(),
      my_favorite: new FormControl(),
      order_date_min : new FormControl(),
      order_date_max : new FormControl(),
    });

  }
  get archivedControl() {
    return this.filterForm.get('archived');
  }
  get bogoControl() {
    return this.filterForm.get('bogo');
  }
  get percentOffControl() {
    return this.filterForm.get('percent_off');
  }
  get rewardsControl() {
    return this.filterForm.get('rewards');
  }
  get voidedControl() {
    return this.filterForm.get('voided');
  }
  get vendorsControl() {
    return this.filterForm.get('vendors');
  }
  get vendorsNameControl() {
    return this.filterForm.get('vendorsName');
  }
  get myFavoriteControl() {
    return this.filterForm.get('my_favorite');
  }
  get orderedFromControl() {
    return this.filterForm.get('order_date_min');
  }
  get orderedToControl() {
    return this.filterForm.get('order_date_max');
  }

  ngOnInit() {
    this.subscribers.getVendorsSubscription = this.vendors$
    .subscribe((res: any) => {
      this.vendorsData = _.flatten(res.data.vendors);
      this.vendorsData.map((vendor: any) => {
        this.vendorsCollection[vendor.name] = null;
      });
    });

    this.subscribers.changeVendorsValueSubscription = this.vendorsNameControl.valueChanges
    .subscribe((vendors: string[]) => {
      const VendorsIds = vendors.map((item) => {
        const vendorId = _.find(this.vendorsData, ['name', item]);
        return vendorId.id;
      });
      this.vendorsControl.setValue(VendorsIds);
    });
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  applyFilters() {
    const filters = new OrdersPageFiltersModel(this.filterForm.value);
    Object.keys(filters).forEach((key) => (filters[key] == null) && delete filters[key]);
    this.pastOrderService.filterQueryParams$.next(filters);
    this.dialog.dismiss();
  }

}
