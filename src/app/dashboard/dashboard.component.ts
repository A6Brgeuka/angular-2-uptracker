import { Component, OnInit } from '@angular/core';

import * as _ from 'lodash';

import { UserService, StateService, AccountService } from '../core/services/index';

@Component({
  selector: 'app-dashboard',
  styleUrls: [ './dashboard.style.scss' ],
  templateUrl: './dashboard.template.html'
})
export class DashboardComponent implements OnInit{
  public selectedOption = '';
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
  }

  changeLocation(event){
    this.accountService.dashboardLocation$.next(_.find(this.locationArr, {'id': event.target.value}));
  }

}
