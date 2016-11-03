import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as _ from 'lodash';
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
  public monthArr: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public monthDirty: boolean = false;

  public currencyArr: any;
  public currencyDirty: boolean = false;
  public currencySign: string ='$';

  private moreThanOneSlider: boolean = false;
  public disabledRange: any = [];
  public viewRangeInput: any = [];
  public rangeTotal: any = []; // array of NaN values for range text inputs
  public maxRange: number = 1000000; // max value for slider range
  private prev_annual_inventory_budget: string; // previous annual budget for 'change' detection
  public amountMask: any = createNumberMask({
    allowDecimal: false,
    prefix: ''
  });

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
      this.currencyArr = _.sortBy(res.data, 'priority');
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
      this.viewRangeInput[i] = false;
      this.accounting.total[i] = parseInt(locationBudget + "");
      this.rangeTotal[i] = this.accounting.total[i];
    }
  }

  changingRange(event: Event, i, byInput = false){
    // choose what input to watch for, depending on changing
    let changedInputValue;
    if (byInput) {
      changedInputValue = this.amount2number(this.rangeTotal[i]);
      this.accounting.total[i] = changedInputValue;
    } else {
      changedInputValue = this.accounting.total[i];
      this.rangeTotal[i] = changedInputValue;
    } 
    let maxRange = this.setMaxRangeFor(i);
    if (changedInputValue >= maxRange){
      event.preventDefault();
      event.stopPropagation();
      this.accounting.total[i] = maxRange;
      this.rangeTotal[i] = this.accounting.total[i];
    }

  }

  setMaxRangeFor(i){
    let otherTotal: number = 0;
    for (let j=0; j<this.locationArr.length; j++) {
      if (i!=j) {
        otherTotal += this.amount2number(this.accounting.total[j]);
      }
    }
    return this.maxRange - otherTotal;
  }

  changeCurrency(){
    let currency = _.find(this.currencyArr, {'iso_code': this.accounting.currency});
    this.currencyDirty = true;
    this.currencySign = currency ? currency['html_entity'] : '$';
  }

  viewCurrencySign(){
    let currency = _.find(this.currencyArr, {'iso_code': this.accounting.currency});
    return currency ? currency['html_entity'] : '$';
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

  editRangeValue(i){
    if (!this.disabledRange[i]){
      this.viewRangeInput[i] = true;
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
    
    this.accountService.putAccounting(this.accounting).subscribe(
      (res: any) => {
        this.router.navigate(['/dashboard']);
      }
    );
  }

}
