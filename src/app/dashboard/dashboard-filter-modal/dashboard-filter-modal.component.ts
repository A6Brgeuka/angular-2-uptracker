import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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
  public searchText: string = "";
  context: DashboardFilterModalContext;

  constructor(
      public dialog: DialogRef<DashboardFilterModalContext>,
      public userService: UserService,
      public accountService: AccountService,
  ) {
    this.context = dialog.context;
  }

  ngOnInit() {}

  searchProducts(event) {}

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
  }
}
