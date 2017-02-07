import {Component, OnInit, NgZone} from '@angular/core';

import * as _ from 'lodash';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { UserService, StateService, AccountService } from '../core/services/index';
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";

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
  public isnotProductUrl$: Observable<any>;

  constructor(
      private userService: UserService,
      private accountService: AccountService,
      private stateService: StateService,
  ) {
    this.locations$ =
        this.accountService.locations$
        .do((res: any) => {
          this.locationArr = res;
          console.log('location arr',res);
        });

  }
  
  ngOnInit(){

    this.subscribers.dashboardLocationSubscription = this.accountService.dashboardLocation$.subscribe((res: any) => {
      this.selectedLocation = res ? res.id : '';
    });
    this.isnotProductUrl$ = this.stateService.navigationEndUrl$.map(url => {
      //debugger;
      return url != "/dashboard/products";
    });
    //this.isnotProductUrl$.subscribe();
//sv: products muct be loaded with selected location
    this.subscribers.dashboardLocationProductSubscription = Observable.combineLatest(
        this.accountService.dashboardLocation$,
        this.isnotProductUrl$
    )
        .filter(([dashloc,isPrdUrl]): any => {
      //debugger;
      return  !isPrdUrl;})
        .switchMap(res => {
          return this.accountService.locations$
        })
        .subscribe( res => {
          this.accountService.dashboardLocation$.next(res[0])
        });
  }

  changeLocation(event){
    this.accountService.dashboardLocation$.next(_.find(this.locationArr, {'id': event.target.value}));
  }

}
