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
    trigger('slidePanel', [
      state('inone', style({
        overflow: 'hidden',
        transform: 'translateX(0)'
      })),
      state('one', style({
        overflow: 'hidden',
        transform: 'translateX(-33.3%)',
      })),
      transition('inone => one', animate(300, style({transform: 'translateX(-33%)'}))),
      transition('one => inone', animate(300, style({transform: 'translateX(0)'}))),

      state('two', style({
        overflow: 'hidden',
        transform: 'translateX(-66.6%)',
      })),
      transition('one => two', animate(300, style({transform: 'translateX(-66%)'}))),
      transition('two => one', animate(300, style({transform: 'translateX(-33%)'}))),
    ]),
    trigger('visiblePanelOne', [
      state('inone', style({ display: 'block' })),
      state('one', style({ display: 'none' })),
      state('two', style({ display: 'none' }))
    ]),
    trigger('visiblePanelTwo', [
      state('inone', style({ display: 'none' })),
      state('one', style({ display: 'block' })),
      state('two', style({ display: 'none' }))
    ]),
    trigger('visiblePanelThree', [
      state('inone', style({ display: 'none' })),
      state('one', style({ display: 'none' })),
      state('two', style({ display: 'block' }))
    ])
  ]
})
@DestroySubscribers()
export class DashboardFilterModal implements OnInit, ModalComponent<DashboardFilterModalContext> {
  public context: DashboardFilterModalContext;
  public searchText: string = '';
  public heightState: string = 'inactive';
  public slideState: string = 'inone';
  public sortBy: string = '';

  constructor(
      public dialog: DialogRef<DashboardFilterModalContext>,
      public userService: UserService,
      public accountService: AccountService,
  ) {
    this.context = dialog.context;
  }

  ngOnInit() {}

  goBackToFirst() {
    this.slideState = 'intwo';
  }

  searchProducts(event) {
    if (event && this.heightState === 'inactive') {
      this.heightState = 'active';
    } else if(!event && this.heightState === 'active') {
      this.heightState = 'inactive';
    }
  }

  toBackSearch() {
    this.slideState = 'inone';
  }

  toBackDetail() {
    this.slideState = 'intwo';
  }

  toGoDetail() {
    this.slideState = 'one';
  }

  toGoSuccess() {
    this.slideState = 'two'
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
  }
}
