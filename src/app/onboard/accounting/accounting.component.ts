import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { UserService, AccountService } from '../../core/services/index';

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.scss']
})
@DestroySubscribers()
export class AccountingComponent implements OnInit {
  public locationArr: any = [];
  public accounting: any = {};
  public currencyArr: any;
  public currencyDirty: boolean = false;
  public currencySign: string ='$';
  public disabledRange: any = [];

  constructor(
      private router: Router,
      private userService: UserService,
      private accountService: AccountService
  ) {
  }

  ngOnInit() {
    // this.subscribers.getLocationsSubscription = this.userService.selfData$.subscribe((res: any) => {
    //   if (res.account) {
    //     this.locationArr = res.account.locations;
    //   }
    // });
    this.disabledRange = [true, false];
    this.accounting.total = [ 300000, 100000 ];



    // materialize="pickadate"
    //     [materializeParams]="[{selectMonths: true, selectYears: 15}]"
  }

  changeCurrency(){
    this.currencyDirty = true;
  }

  toggleLock(i){
    this.disabledRange[i] = !this.disabledRange[i]; 
  }

  goBack(){
    this.router.navigate(['/onboard','users']);
  }

  onSubmit(){
    
  }

}
