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
  public textInputRangeTotal: any = []; // array of NaN values for range text inputs
  public maxRange: number; // max value for slider range
  public amountMask: any = createNumberMask({
    allowDecimal: false,
    prefix: ''
  });
  private prevInputValue: any = [];
  public rangeStep: number = 1000;
  private prev_annual_inventory_budget: string; // previous annual budget for 'change' detection on blur

  constructor(
      private router: Router,
      private userService: UserService,
      private accountService: AccountService,
      private toasterService: ToasterService
  ) {
  }

  ngOnInit() {
    this.accounting = this.accountService.onboardAccounting;
    this.maxRange = this.amount2number(this.accounting.annual_inventory_budget) || 1000000;
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
      this.currencyArr = res;
    });
  }

  annualInventoryBudgetChange(event){
    // check if value changed
    if (this.accounting.annual_inventory_budget == this.prev_annual_inventory_budget) {
      return;
    }

    this.accounting.annual_inventory_budget = this.amount2number(event.target.value) || 1000000;
    this.prev_annual_inventory_budget = this.accounting.annual_inventory_budget;
    this.maxRange = this.accounting.annual_inventory_budget;
    // set stored slider input values to null
    let nulledTotals = _.map(this.accountService.onboardAccounting.total, (value) => {
      return null;
    });
    this.accountService.onboardAccounting.total = nulledTotals;
    this.setLocationBudget();
  }

  setLocationBudget(){
    let annual_inventory_budget = this.accounting.annual_inventory_budget || 1000000;
    let locationBudget: number = this.amount2number(annual_inventory_budget) / this.locationArr.length;

    // check if saved values count == current locations count for setting the values
    if (this.accountService.onboardAccounting.total.length != this.accounting.total.length)
        _.map(this.accountService.onboardAccounting, (value) => {
          return null;
        });

    for (let i=0; i<this.locationArr.length; i++){
      this.disabledRange[i] = !this.moreThanOneSlider;
      this.viewRangeInput[i] = false;

      let budgetValue = this.accountService.onboardAccounting.total[i] || this.amount2number(locationBudget);
      this.setSliderValue(i, budgetValue);
      // store budget amount to know previous value
      this.prevInputValue[i] = this.accounting.total[i];
      console.log('total '+i, this.prevInputValue[i]);
    }
  }

  changingRange(event, i, byInput = false){
    //check if unlocked sliders exists to allow changing amount
    let k = 0, unlockedSliders = [];
    for (let j=0; j<this.accounting.total.length; j++){
      if (!this.disabledRange[j] && j != i){
        k++;
        unlockedSliders.push(this.accounting.total[j]);
      }
    }
    if (k==0) {
      this.setSliderValue(i, this.prevInputValue[i]);
      return;
    }

    // if new value greater than maximum than change value to max
    let changedInputValue = this.amount2number(event.target.value) < this.setMaxRangeFor(i) ? this.amount2number(event.target.value) : this.setMaxRangeFor(i);
    this.setSliderValue(i, changedInputValue);

    // TODO: remove after accepting the concept of accounting sliders logic
    // let maxRange = this.setMaxRangeFor(i);
    // if (changedInputValue >= maxRange){
    //   event.preventDefault();
    //   event.stopPropagation();
    //   this.accounting.total[i] = maxRange;
    //   this.textInputRangeTotal[i] = this.accounting.total[i];
    // }

    let diff = !this.disabledRange[i] ? changedInputValue - this.prevInputValue[i] : false;
    console.log('diff', diff);
    for (let j=0; j<this.accounting.total.length; j++){
      // handle negative values
      if ((this.accounting.total[j] <= 0 && diff > 0) || this.accounting.total[j] > this.maxRange) {
        k--;
        if (k == 0)  {
          this.setSliderValue(i, this.prevInputValue[i]);
          return;
        }
      }

      // move not active sliders
      if (i != j && !this.disabledRange[j]) {
        this.setSliderValue(j, this.accounting.total[j] - diff / k);
        this.prevInputValue[j] = this.accounting.total[j];
      }
    }
    this.prevInputValue[i] = changedInputValue;
  }

  setSliderValue(i, value){ console.log('new value', value);
    value = value > 0 ? value : 0;
    this.accounting.total[i] = value;
    this.textInputRangeTotal[i] = this.accounting.total[i];
  }

  saveOldValue(i){
    // this.prevInputValue[i] = this.amount2number(this.accounting.total[i]);
  }

  rangeChanged(event, i){
    // let changedInputValue = event.target.valueAsNumber;
    // this.accounting.total[i] = changedInputValue;
    // this.textInputRangeTotal[i] = this.accounting.total[i];
    // let diff = changedInputValue - this.prevInputValue;
    // console.log(diff);
    //
    // for (let j=0; j<this.accounting.total.length; j++){
    //   if (i != j) {
    //     this.accounting.total[j] -= diff / (this.accounting.total.length - 1);
    //     this.textInputRangeTotal[j] = this.accounting.total[j];
    //   }
    // }
  }

  // TODO: remove after accepting the concept of accounting sliders logic
  // setMaxRangeFor(i){
  //   let otherTotal: number = 0;
  //   for (let j=0; j<this.locationArr.length; j++) {
  //     if (i!=j) {
  //       otherTotal += this.amount2number(this.accounting.total[j]);
  //     }
  //   }
  //   return this.maxRange - otherTotal;
  // }

  setMaxRangeFor(i){
    let otherTotal: number = 0;
    for (let j=0; j<this.locationArr.length; j++) {
      if (i!=j && this.disabledRange[j]) {
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
