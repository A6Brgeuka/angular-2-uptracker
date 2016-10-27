import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as lodashSort from 'lodash/sortBy';
import * as lodashFind from 'lodash/find';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

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
  public maxRange: number = 1000000;
  public monthArr: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public monthDirty: boolean = false;
  private moreThanOneSlider: boolean = false;
  public amountMask: any = createNumberMask({
    allowDecimal: false,
    prefix: ''
  });
  private prev_annual_inventory_budget: string;

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
      budget_distribution: [],
      currency: 'USD'
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
    // compare with previous value. if changed then set new location budgets
    if (this.accounting.annual_inventory_budget != this.prev_annual_inventory_budget) {
      this.prev_annual_inventory_budget = this.accounting.annual_inventory_budget;
      let annual_inventory_budget = this.accounting.annual_inventory_budget || 1000000;
      this.maxRange = this.amount2number(annual_inventory_budget);
      this.setLocationBudget();
    }
  }

  setLocationBudget(){
    let locationBudget: number = 0;
    let annual_inventory_budget = this.accounting.annual_inventory_budget || 0;
    if (this.moreThanOneSlider){
      locationBudget = this.amount2number(annual_inventory_budget) / this.locationArr.length;
    } else {
      locationBudget = this.amount2number(annual_inventory_budget);
    }
    for (let i=0; i<this.locationArr.length; i++){
      this.disabledRange[i] = !this.moreThanOneSlider;
      this.accounting.total[i] = parseInt(locationBudget + "");
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
    let otherTotal: number = 0;
    for (let j=0; j<this.locationArr.length; j++) {
      if (i!=j) {
        otherTotal += this.accounting.total[j];
      }
    }
    return this.maxRange - otherTotal;
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

  amount2number(amount){
    amount = amount || 0;
    amount = ('' + amount).replace(/,/g, "");
    return amount ? parseInt(amount) : 0;
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
