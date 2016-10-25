import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as lodashSort from 'lodash/sortBy';
import * as lodashFind from 'lodash/find';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { UserService, AccountService } from '../../core/services/index';

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
  public monthArr: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public monthDirty: boolean = false;

  constructor(
      private router: Router,
      private userService: UserService,
      private accountService: AccountService
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
        for (let i=0; i<this.locationArr.length; i++){
          this.disabledRange.push(false);
          this.accounting.total.push(0);
        }
      }
    });
    this.subscribers.getCurrencySubscription = this.accountService.getCurrencies().subscribe((res) => {
      this.currencyArr = lodashSort(res.data, 'priority');
    });
  }

  changeCurrency(){
    let currency = lodashFind(this.currencyArr, {'iso_code': this.accounting.currency});
    this.currencyDirty = true;
    // this.currencySign = currency ? currency['html_entity'] : '$';
  }

  changeDate(){
    this.monthDirty = true;
  }

  toggleLock(i){
    this.disabledRange[i] = !this.disabledRange[i]; 
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
