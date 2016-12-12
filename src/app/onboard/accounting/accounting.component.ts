import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as _ from 'lodash';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import { UserService, AccountService, ToasterService, SessionService } from '../../core/services/index';

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
  public rangeStep: number = 1;
  private prev_annual_inventory_budget: string; // previous annual budget for 'change' detection on blur

  constructor(
      private router: Router,
      private userService: UserService,
      private accountService: AccountService,
      private toasterService: ToasterService,
      private sessionService: SessionService
  ) {
  }

  ngOnInit() {
    this.accounting = this.accountService.onboardAccounting;
    this.maxRange = this.amount2number(this.accounting.annual_inventory_budget) || 0; //1000000;
    this.subscribers.getLocationsSubscription = this.userService.selfData$
      .filter(res => res.account)
      .subscribe((res: any) => {
        this.locationArr = res.account.locations;
        if (this.locationArr.length > 1) {
          this.moreThanOneSlider = true;
        }
        this.setLocationBudget();
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

    this.accounting.annual_inventory_budget = this.amount2number(event.target.value) || 0; //1000000;
    this.prev_annual_inventory_budget = this.accounting.annual_inventory_budget;
    this.maxRange = this.accounting.annual_inventory_budget;
    // set stored slider input values to null
    let nulledTotals = _.map(this.accountService.onboardAccounting.total, (value) => {
      return null;
    });
    this.accountService.onboardAccounting.total = nulledTotals;
    this.setLocationBudget();
    this.sessionService.setLocal("annual_inventory_budget", this.accounting.annual_inventory_budget)
  }

  setLocationBudget(){
    let annual_inventory_budget = this.accounting.annual_inventory_budget;
    let locationBudget: number = this.amount2number(annual_inventory_budget) / this.locationArr.length;
    let mod: number = this.amount2number(annual_inventory_budget) % this.locationArr.length;

    // check if saved location budget values count == current locations count for setting the values
    if (this.accountService.onboardAccounting.total.length != this.locationArr.length) {
      // set array length to current locationArr length and fill it with null values
      this.accountService.onboardAccounting.total = _.map(_.cloneDeep(this.locationArr), (value) => {
        return null;
      });
    }

    for (let i=0; i<this.locationArr.length; i++){
      this.disabledRange[i] = !this.moreThanOneSlider;

      let budgetValue = this.accountService.onboardAccounting.total[i] || this.amount2number(locationBudget) + mod;
      mod = 0;
      this.setSliderValue(i, budgetValue);

      // store budget amount to know previous value
      this.prevInputValue[i] = this.accounting.total[i];
      console.log('prev value '+i, this.prevInputValue[i]);
    }
  }

  changingRange(event, i, byInput = false){
    //check if unlocked sliders exists to allow changing amount
    let unlockedSliders: number = 0;
    for (let j=0; j<this.accounting.total.length; j++){
      if (!this.disabledRange[j] && j != i)
        unlockedSliders++;
    }
    if (unlockedSliders==0) {
      this.setSliderValue(i, this.prevInputValue[i]);
      return;
    }

    // TODO: remove after accepting the concept of accounting sliders logic
    // let maxRange = this.setMaxRangeFor(i);
    // if (changedInputValue >= maxRange){
    //   event.preventDefault();
    //   event.stopPropagation();
    //   this.accounting.total[i] = maxRange;
    //   this.textInputRangeTotal[i] = this.accounting.total[i];
    // }

    // if new value greater than maximum than change value to max
    let changedInputValue = this.amount2number(event.target.value) < this.setMaxRangeFor(i) ? this.amount2number(event.target.value) : this.setMaxRangeFor(i);
    console.log('---------------------------');
    console.log('event value = ', event.target.value);
    console.log('changedInputValue = ', changedInputValue);
    this.setSliderValue(i, changedInputValue);

    // count difference between new and prev values
    let diff = changedInputValue - this.prevInputValue[i];
    console.log('diff', diff);

    // calculate amount of sliders that can be changed (not current draggable slider && enabled slider && slider value is > 0)
    let k: number = 0;
    _.each(this.accounting.total, (value, key) => {
      let cond = diff > 0 ? value > 0 : true;
      if ( i != key && !this.disabledRange[key] && cond) {
        k++;
      }
    });
    console.log('active sliders counter = ', k);

    // count modulo
    let num: number = diff > 0 ? Math.floor(diff/k) : Math.ceil(diff/k);
    let mod: number = diff % k;
    console.log('num', num);
    console.log('mod', mod);

    // use cycle to handle potential modular on last slider (until mod == 0)
    do {
      _.each(this.accounting.total, (value, key) => {
        console.log('----------', key);
        // handle negative and over maximum values (for text inputs)
        if ((this.accounting.total[key] <= 0 && diff > 0) || (this.accounting.total[key] > this.maxRange && diff < 0)) {
          unlockedSliders--;
          if (unlockedSliders == 0) {
            this.setSliderValue(i, this.prevInputValue[i]);
          }
          return;
        }

        // move not active sliders and add mod to some sliders
        if (i != key && !this.disabledRange[key]) {
          let delta: number = num + mod;
          let newValue: number = this.accounting.total[key] - delta;
          console.log('prev value ' + key + ' = ', this.accounting.total[key]);

          console.log('mod ' + key + ' before =', mod);
          // share mod on all other locations
          if (newValue < 0) { // if mod is too big set new value to 0 and update mod
            mod = -newValue;
            newValue = 0;
          } else {
            mod = 0;
          }
          console.log('mod ' + key + ' after =', mod);
          this.setSliderValue(key, newValue); // TODO: diff/k => delta
          this.prevInputValue[key] = this.accounting.total[key];
          // this.sessionService.setLocal()
        }

        // if last slider and mod != 0 than set num to null for next do while iteration
        if (mod != 0 && this.amount2number(key) == this.accounting.total.length - 1)
            num = 0;
      });
    } while (mod != 0);
    this.prevInputValue[i] = changedInputValue;
    this.sessionService.setLocal("budget_destribution_per_location", JSON.stringify(this.accounting.total));
  }

  setSliderValue(i, value){ console.log('new value ' + i + ' = ', value);
    value = value > 0 ? Math.round(value) : 0; //TODO: math.func depends on diff
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

  changeCurrency(event){
    let currency = _.find(this.currencyArr, {'iso_code': this.accounting.currency});
    this.currencyDirty = true;
    this.currencySign = currency ? currency['html_entity'] : '$';
    this.sessionService.setLocal('currency', event.target.value);
  }

  changeAnnualIncome(event) {
    this.sessionService.setLocal('annual_income', this.amount2number(event.target.value));
  }

  viewCurrencySign(){
    let currency = _.find(this.currencyArr, {'iso_code': this.accounting.currency});
    return currency ? currency['html_entity'] : '$';
  }

  changeDate(event){
    this.monthDirty = true;
    this.sessionService.setLocal('fiscal_year', event.target.value);
  }

  changeForm(event){
    debugger;
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

  // TODO: remove after testings
  // getActiveSlidersWithout(i){
  //   let arr = [];
  //   for (let j=0; j<this.accounting.total.length; j++){
  //     if (!this.disabledRange[j] && i != j)
  //         arr[j] = this.accounting.total[j];
  //   }
  //   return arr;
  // }

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
