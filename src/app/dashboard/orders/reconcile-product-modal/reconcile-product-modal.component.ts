import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Observable } from 'rxjs/Rx';
import { UserService, AccountService } from '../../../core/services';
import * as _ from 'lodash';


export class ReconcileProductModalContext extends BSModalContext {
  public product: any;
}

@Component({
  selector: 'transfer-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './reconcile-product-modal.component.html',
  styleUrls: ['./reconcile-product-modal.component.scss']
})
@DestroySubscribers()
export class ReconcileProductModal implements OnInit, ModalComponent<ReconcileProductModalContext> {
  public context: ReconcileProductModalContext;
  public subscribers: any = {};
  public modalState: number = 0;
  public groups: Array<any> = [];
  public searchText: string = '';
  public location: string = '';
  public variant: string = 'Box';
  public quantity: string = '300';
  public discount: string = '20.00';
  public discountType: string = '%';
  public selectedGroup: any;

  constructor(
    public dialog: DialogRef<ReconcileProductModalContext>,
    public userService: UserService,
    public accountService: AccountService,
  ) {
    this.context = dialog.context;
    this.groups = [{
      name: 'Gloves Tender Touch Nitrile',
      info: 'Gloves Tender Touch Nitrile Sempercare PF 200/box',
      counts: 13,
      min: 5,
      max: 30,
      on_hand: 15,
      critical_level: 10,
      overstock_level: 25,
    }];
  }

  ngOnInit() {}

  productChange() {}

  searchProducts(event) {}

  addOrder() {
    this.dialog.dismiss();
  }

  goBackToFirst() {
    this.modalState = 0;
  }

  toBackInitial() {
    this.modalState = 0;
    this.searchText = '';
  }

  toGoModal(state, index) {
    this.modalState = state;
    if (index !== undefined) {
      this.selectedGroup = this.groups[index];
    }
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
  }
}
