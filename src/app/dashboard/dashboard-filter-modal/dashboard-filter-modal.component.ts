import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { VendorModel } from '../../models/index';
import { UserService, AccountService } from '../../core/services';
import * as _ from 'lodash';


export class DashboardFilterModalContext extends BSModalContext {
  public product: any;
}

@Component({
  selector: 'dashboard-filter-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './dashboard-filter-modal.component.html',
  styleUrls: ['./dashboard-filter-modal.component.scss'],
  animations: [
    trigger('heightPanel', [
      state('inactive', style({
        overflow: 'hidden',
        height: 0,
      })),
      state('active', style({
        overflow: 'hidden',
        height: '*'
      })),
      transition('inactive => active', animate('300ms ease-in')),
      transition('active => inactive', animate('300ms ease-out'))
    ]),
    trigger('slideSearch', [
      state('inactive', style({
        overflow: 'hidden',
        transform: 'translateX(0)'
      })),
      state('active', style({
        overflow: 'hidden',
        transform: 'translateX(-100%)',
        visibility: 'hidden'
      })),
      transition('inactive => active', animate(300, style({transform: 'translateX(-100%)'}))),
      transition('active => inactive', animate(300, style({transform: 'translateX(0)'})))
    ]),
    trigger('slideProduct', [
      state('inactive', style({
        display: 'none',
        overflow: 'hidden',
        transform: 'translateX(100%)'
      })),
      state('active', style({
        display: 'block',
        overflow: 'hidden',
        transform: 'translateX(0)',
      })),
      transition('inactive => active', animate(300, style({transform: 'translateX(-100%)'}))),
      transition('active => inactive', animate(300, style({transform: 'translateX(0)'})))
    ])
  ]
})
@DestroySubscribers()
export class DashboardFilterModal implements OnInit, ModalComponent<DashboardFilterModalContext> {
  public context: DashboardFilterModalContext;
  public searchText: string = '';
  public heightState: string = 'inactive';
  public slideSearchState: string = 'inactive';

  constructor(
      public dialog: DialogRef<DashboardFilterModalContext>,
      public userService: UserService,
      public accountService: AccountService,
  ) {
    this.context = dialog.context;
  }

  ngOnInit() {}

  searchProducts(event) {
    if (event && this.heightState === 'inactive') {
      this.heightState = 'active';
    } else if(!event && this.heightState === 'active') {
      this.heightState = 'inactive';
    }
  }

  toggleProductDetail() {
    if (this.slideSearchState === 'inactive') {
      this.slideSearchState = 'active';
    } else {
      this.slideSearchState = 'inactive';
    }
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
  }
}
