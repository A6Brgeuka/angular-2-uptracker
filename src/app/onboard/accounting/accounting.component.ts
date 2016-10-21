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
  private subscribers: any = {};

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
  }

  goBack(){
    this.router.navigate(['/onboard','users']);
  }

  goNext(){
    
  }

}
