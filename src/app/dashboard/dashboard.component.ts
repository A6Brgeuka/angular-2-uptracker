import { Component, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { UserService, StateService } from '../core/services/index';

@Component({
  selector: 'app-dashboard',
  styleUrls: [ './dashboard.style.scss' ],
  templateUrl: './dashboard.template.html'
})
@DestroySubscribers()
export class DashboardComponent implements OnInit{
  private subscribers: any = {};
  public selectedOption = '';
  public locationArr: any;

  constructor(
      private userService: UserService,
      private stateService: StateService
  ) { 
  }
  
  ngOnInit(){
    this.subscribers.getLocationsSubscription = this.userService.selfData$.subscribe((res: any) => {
      this.locationArr = res.account.locations;
    });
  }

  changeLocation(event){
    let value = event.target.value;
  }

}
