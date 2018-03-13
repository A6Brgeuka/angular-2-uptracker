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
  styleUrls: ['./dashboard-filter-modal.component.scss']
})
@DestroySubscribers()
export class DashboardFilterModal implements OnInit, ModalComponent<DashboardFilterModalContext> {
  public context: DashboardFilterModalContext;
  public searchText: string = '';
  public modalState: number = 0;
  public sortBy: string = '';

  public stockMini: number = 30;
  public stockMiniLimit: number = 30;
  public stockShelf: number = 133;
  public stockShelfLimit: number = 133;
  public stockSterlization: number = 2;
  public stockSterlizationLimit: number = 2;

  constructor(
      public dialog: DialogRef<DashboardFilterModalContext>,
      public userService: UserService,
      public accountService: AccountService,
  ) {
    this.context = dialog.context;
  }

  ngOnInit() {}

  goBackToFirst() {
    this.modalState = 0;
  }

  itemsSort(event) {
    this.stockMini = Math.round(100 * Math.random());
    this.stockMiniLimit = this.stockMini;
    this.stockShelf = Math.round(100 * Math.random());
    this.stockShelfLimit = this.stockShelf;
    this.stockSterlization = Math.round(100 * Math.random());
    this.stockSterlizationLimit = this.stockSterlization;
  }

  searchProducts(event) {}

  stockMiniClick(value) {
    this.stockMini += value;
  }

  stockShelfClick(value) {
    this.stockShelf += value;
  }

  stockSterlizationClick(value) {
    this.stockSterlization += value;
  }

  toBackInitial() {
    this.modalState = 0;
    this.searchText = '';
  }

  toBackSearch() {
    this.modalState = 0;
  }

  toBackDetail() {
    this.modalState = 1;
  }

  toGoDetail() {
    this.modalState = 1;
  }

  toGoSuccess() {
    this.modalState = 2;
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
  }
}
