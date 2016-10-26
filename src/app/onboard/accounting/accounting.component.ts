import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as lodashSort from 'lodash/sortBy';
import * as lodashFind from 'lodash/find';
import * as lodashReject from 'lodash/reject';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { UserService, AccountService, ToasterService } from '../../core/services/index';

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.scss']
})
@DestroySubscribers()
export class AccountingComponent implements OnInit {
  private subscribers: any = {};
  public locationArr: any = [];
  public accounting: any = {};
  public currencyArr: any;
  public currencyDirty: boolean = false;
  public currencySign: string ='$';
  public disabledRange: any = [];
  public maxRange: number;
  public monthArr: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public monthDirty: boolean = false;
  private moreThanOneSlider: boolean = false;

  constructor(
      private router: Router,
      private userService: UserService,
      private accountService: AccountService,
      private toasterService: ToasterService
  ) {
  }

  ngOnInit() {
    this.accounting = {
      total: [],
      budget_distribution: []
    };
    this.subscribers.getLocationsSubscription = this.userService.selfData$.subscribe((res: any) => {
      if (res.account) { 
        this.locationArr = res.account.locations;
        if (this.locationArr.length > 1) {
          this.moreThanOneSlider = true;
        }
        this.setLocationBudget();
      }
    });
    this.subscribers.getCurrencySubscription = this.accountService.getCurrencies().subscribe((res) => {
      this.currencyArr = lodashSort(res.data, 'priority');
    });
  }

  annualInventoryBudgetChanged(){
    this.maxRange = parseInt(this.accounting.annual_inventory_budget) || 1000000;
    this.setLocationBudget();
  }

  setLocationBudget(){
    let locationBudget: number;
    if (this.moreThanOneSlider){
      locationBudget = (parseInt(this.accounting.annual_inventory_budget) || 0) / this.locationArr.length;
    } else {
      locationBudget = parseInt(this.accounting.annual_inventory_budget) || 0;
    }
    for (let i=0; i<this.locationArr.length; i++){
      this.disabledRange[i] = !this.moreThanOneSlider;
      this.accounting.total[i] = locationBudget;
    }
  }

  changingRange(event: Event, i){
    let maxRange = this.setMaxRangeFor(i);
    if (this.accounting.total[i] >= maxRange){
      event.preventDefault();
      event.stopPropagation();
      this.accounting.total[i] = maxRange;
    }
  }

  setMaxRangeFor(i){
    let max = parseInt(this.accounting.annual_inventory_budget);
    // let otherLocations = lodashReject(this.locationArr, {'id': this.locationArr[i]['id']});
    let otherTotal: number = 0;
    for (let j=0; j<this.locationArr.length; j++) {
      if (i!=j) {
        otherTotal += this.accounting.total[j];
      }
    }
    return max - otherTotal;
  }

  changeCurrency(){
    let currency = lodashFind(this.currencyArr, {'iso_code': this.accounting.currency});
    this.currencyDirty = true;
    // this.currencySign = currency ? currency['html_entity'] : '$';
  }

  changeDate(){
    this.monthDirty = true;
  }

  toggleLock(i) {
    if (this.moreThanOneSlider) {
      this.disabledRange[i] = !this.disabledRange[i];
    } else {
      this.toasterService.pop('error', 'Only multiple locations can be adjusted.');
    }
  }

  goBack(){
    this.router.navigate(['/onboard','users']);
  }

  onSubmit(){
    this.accounting.account_id = this.userService.selfData.account_id;
    for (let i=0; i<this.locationArr.length;i++){
      this.accounting.budget_distribution[i] = {
        location_id: this.locationArr[i].id,
        annual_budget: this.accounting.total[i]
      }
    }
    debugger;
    // this.accountService.putAccounting(this.accounting).subscribe(
    //   (res: any) => {
    //     this.router.navigate(['/dashboard']);
    //   }
    // );
  }

}
