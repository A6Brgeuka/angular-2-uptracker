import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { UserService, StateService, AccountService } from '../core/services/index';
import { Observable } from "rxjs";
import { DashboardService } from '../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.style.scss'],
  templateUrl: './dashboard.template.html'
})
@DestroySubscribers()
export class DashboardComponent implements OnInit {
  public subscribers: any = {};
  public selectedLocation: string = '';
  public locations$: any;
  public locationArr: any;
  
  constructor(
    public userService: UserService,
    public accountService: AccountService,
    public stateService: StateService,
    public dashboardService: DashboardService
  ) {
    this.locations$ = Observable.combineLatest(
      this.accountService.locations$,
      this.stateService.navigationEndUrl$
    )
    .map(([locations, navigationEndUrl]): any => locations)
    .do((res: any) => {
      this.locationArr = res;
      console.log('location arr', res);
    });
    
  }
  
  ngOnInit() {
    
    this.subscribers.dashboardLocationSubscription = this.accountService.dashboardLocation$.subscribe((res: any) => {
      this.selectedLocation = res ? res.id : '';
    });
    this.subscribers.dashboardLocationProductSubscription = this.accountService.locations$
    .subscribe(res => {
      this.locationArr = res;
    });
    
  }
  
  changeLocation(event) {
    this.accountService.dashboardLocation$.next(_.find(this.locationArr, {'id': event.target.value}));
  }
  
}
