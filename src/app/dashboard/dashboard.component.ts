import { Component, OnInit } from '@angular/core';

import * as _ from 'lodash';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { UserService, StateService, AccountService } from '../core/services/index';

@Component({
  selector: 'app-dashboard',
  styleUrls: [ './dashboard.style.scss' ],
  templateUrl: './dashboard.template.html'
})
@DestroySubscribers()
export class DashboardComponent implements OnInit{
  private subscribers: any = {};
  public selectedLocation: string = '';
  public locations$: any;
  private locationArr: any;

  constructor(
      private userService: UserService,
      private accountService: AccountService,
      private stateService: StateService
  ) { 
  }
  
  ngOnInit(){
    this.locations$ = this.accountService.locations$.do((res: any) => {
      this.locationArr = res;
    });
    this.subscribers.dashboardLocationSubscription = this.accountService.dashboardLocation$.subscribe((res: any) => {
      this.selectedLocation = res ? res.id : '';
    });
  }

  changeLocation(event){
    this.accountService.dashboardLocation$.next(_.find(this.locationArr, {'id': event.target.value}));
  }

}
