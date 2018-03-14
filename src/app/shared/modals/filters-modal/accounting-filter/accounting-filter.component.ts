import { Component } from '@angular/core';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { FormControl } from '@angular/forms';

import { AccountService } from '../../../../core/services/account.service';

@Component({
  selector: 'app-accounting-filter',
  templateUrl: './accounting-filter.component.html',
})
@DestroySubscribers()
export class AccountingFilterComponent {

  public accountings = new FormControl([]);
  public accountingCollection = {'': null};

  public autocompleteAccountings = {
    autocompleteOptions: {
      data: this.accountingCollection,
      limit: Infinity,
      minLength: 1,
    }
  };

  private subscribers: any = {};

  constructor(
    private accountService: AccountService,
  ) {
  }

  addSubscribers() {
    this.subscribers.getProductCategoriesSubscription = this.accountService.getProductAccounting()
    .subscribe((res: any) => {
      const categoriesData = [...res];
      categoriesData.map((accounting) =>
        this.accountingCollection[accounting] = null
      );
    });
  }

}
