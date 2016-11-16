import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { UserService, AccountService } from '../../core/services/index';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
@DestroySubscribers()
export class OrdersComponent implements OnInit {
  public locationArr: any = [];
  private subscribers: any = {};

  constructor(
      private router: Router,
      private userService: UserService,
      private accountService: AccountService
  ) {
  }

  ngOnInit() {
    this.subscribers.getLocationsSubscription = this.userService.selfData$.subscribe((res: any) => {
      if (res.account) {
        this.locationArr = res.account.locations;
      }
    });
  }

}
