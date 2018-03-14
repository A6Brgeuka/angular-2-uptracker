import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { CloseGuard, DialogRef, ModalComponent } from 'angular2-modal';
import * as _ from 'lodash';

import { AccountService } from '../../../core/services/account.service';
import { Observable } from 'rxjs/Observable';
import { VendorService } from '../../../core/services/vendor.service';

export class FiltersModalContext extends BSModalContext {
  public filters: any;
}

@Component({
  selector: 'app-filters-modal',
  templateUrl: './filters-modal.component.html',
  styleUrls: ['./filters-modal.component.scss'],
})
@DestroySubscribers()
export class FiltersModalComponent implements OnInit, CloseGuard, ModalComponent<FiltersModalContext> {
  context;
  private subscribers: any = {};

  vendors = new FormControl([]);
  categories = new FormControl([]);
  productCategoriesCollection = {'': null};
  vendorsCollection = {'': null};
  departmentCollection$: Observable<string[]> = this.accountService.getDepartments();
  locations$ = this.accountService.locations$;
  discounts = ['Bogo', 'Percent Off', 'Rewards Points Used'];

  autocompleteCategories = {
    autocompleteOptions: {
      data: this.productCategoriesCollection,
      limit: Infinity,
      minLength: 1,
    }
  };

  autocompleteVendors = {
    autocompleteOptions: {
      data: this.vendorsCollection,
      limit: Infinity,
      minLength: 1,
    }
  };

  constructor(
    public dialog: DialogRef<FiltersModalContext>,
    private accountService: AccountService,
    private vendorService: VendorService,
  ) {
    this.context = dialog.context;
  }

  ngOnInit() {

  }

  addSubscribers() {
    this.subscribers.getProductCategoriesSubscription = this.accountService.getProductCategories()
    .subscribe((res: any) => {
      const categoriesData = [...res];
      categoriesData.map((test) =>
        this.productCategoriesCollection[test] = null
      );
    });

    this.subscribers.getVendorsSubscription = this.vendorService.getVendors()
    .subscribe((res: any) => {
      const vendorsData = _.flattenDeep(res.data.vendors);
      vendorsData.map((test: any) => {
        this.vendorsCollection[test.name] = null;
      });
    });
  }

  dismissModal() {
    this.dialog.dismiss();
  }
}
