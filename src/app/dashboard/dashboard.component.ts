import { Component, OnInit } from '@angular/core';

import { UserService, StateService } from '../core/services/index';

@Component({
  selector: 'app-dashboard',
  styleUrls: [ './dashboard.style.scss' ],
  templateUrl: './dashboard.template.html'
})
export class DashboardComponent implements OnInit{
  public selectedOption = '';
  public locations$: any;

  constructor(
      private userService: UserService,
      private stateService: StateService
  ) { 
  }
  
  ngOnInit(){
    this.locations$ = this.userService.selfData$
        .map((res: any) => { 
          if (res.account)
            return res.account.locations;
        });
  }

  changeLocation(event){
    let value = event.target.value;
  }

}
