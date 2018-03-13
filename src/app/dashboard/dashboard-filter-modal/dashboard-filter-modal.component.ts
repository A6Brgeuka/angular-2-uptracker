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
    trigger('growPanel', [
      state('inone', style({
        overflow: 'hidden',
        height: '150px',
      })),
      state('one', style({
        overflow: 'hidden',
        height: '300px'
      })),
      state('two', style({
        overflow: 'hidden',
        height: '*'
      })),
      state('three', style({
        overflow: 'hidden',
        height: '*'
      })),
      transition('inone => one', animate('300ms ease-in')),
      transition('one => inone', animate('300ms ease-out')),
      transition('one => two', animate('300ms ease-in')),
      transition('two => one', animate('300ms ease-out')),
      transition('two => three', animate('300ms ease-out'))
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
  public slideState: string = 'inone';
  public growState: string = 'inone';
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
    if (event && this.growState === 'inone') {
      this.growState = 'one';
    } else if(!event && this.growState === 'one') {
      this.growState = 'inone';
    }
  }

  toBackSearch() {
    this.slideState = 'inone';
    this.growState = 'one';
  }

  toBackDetail() {
    this.slideState = 'intwo';
  }

  toGoDetail() {
    this.slideState = 'one';
    this.growState = 'two';
  }

  toGoSuccess() {
    this.slideState = 'two';
    this.growState = 'three';
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
  }
}
