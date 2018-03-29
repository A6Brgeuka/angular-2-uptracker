import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Observable } from 'rxjs/Observable';

import { AccountService } from '../../../../core/services/account.service';

export class InventoryGroupFiltersModalContext extends BSModalContext {
  public filters: any;
}

@Component({
  selector: 'app-inventory-group-filters',
  templateUrl: './inventory-group-filters.component.html',
})
@DestroySubscribers()
export class InventoryGroupFiltersComponent implements OnInit, ModalComponent<InventoryGroupFiltersModalContext> {
  private subscribers: any = {};
  public context;
  public filterForm: FormGroup;
  public departmentCollection$: Observable<any> = this.accountService.getDepartments();

  constructor(
    public dialog: DialogRef<InventoryGroupFiltersModalContext>,
    private accountService: AccountService,
  ) {
    this.context = dialog.context;

    this.filterForm = new FormGroup({
      vendors: new FormControl(),
      categories: new FormControl(),
      departments: new FormControl(),
      accountings: new FormControl(),
      myFavorite: new FormControl(),
      orderedFrom: new FormControl(),
      orderedTo: new FormControl(),
      withoutPrice: new FormControl(),
      belowCriticalLevel: new FormControl(),
      aboveFullyStocked: new FormControl(),
      trackingInfo: new FormControl(),
      mostFrequentlyOrdered: new FormControl(),
      hazardous: new FormControl(),
      trackable: new FormControl(),
      taxExempt: new FormControl(),
      retired: new FormControl(),
    });

  }

  get vendorsControl() {
    return this.filterForm.get('vendors');
  }
  get categoriesControl() {
    return this.filterForm.get('categories');
  }
  get departmentsControl() {
    return this.filterForm.get('departments');
  }
  get accountingsControl() {
    return this.filterForm.get('accountings');
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
  get withoutPriceControl() {
    return this.filterForm.get('withoutPrice');
  }
  get belowCriticalLevelControl() {
    return this.filterForm.get('belowCriticalLevel');
  }
  get aboveFullyStockedControl() {
    return this.filterForm.get('aboveFullyStocked');
  }
  get mostFrequentlyOrderedControl() {
    return this.filterForm.get('mostFrequentlyOrdered');
  }
  get hazardousControl() {
    return this.filterForm.get('hazardous');
  }
  get trackableControl() {
    return this.filterForm.get('trackable');
  }
  get taxExemptControl() {
    return this.filterForm.get('taxExempt');
  }
  get trackingInfoControl() {
    return this.filterForm.get('trackingInfo');
  }
  get retiredControl() {
    return this.filterForm.get('retired');
  }

  ngOnInit() {

  }

  dismissModal() {
    this.dialog.dismiss();
  }

  applyFilters() {
    Object.keys(this.filterForm.value).forEach((key) => (this.filterForm.value[key] == null) && delete this.filterForm.value[key]);
    console.log(this.filterForm.value);
    this.dialog.dismiss();
  }

}
