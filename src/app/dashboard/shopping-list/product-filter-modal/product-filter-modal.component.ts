import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

import { UserService, AccountService } from '../../../core/services/index';
import { SlFilters } from '../../../models/slfilters.model';

export class ProductFilterModalContext extends BSModalContext {
  public product: any;
  public callback = function(a:any){};
}

@Component({
  selector: 'app-product-filter-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  templateUrl: './product-filter-modal.component.html',
  styleUrls: ['./product-filter-modal.component.scss']
})
@DestroySubscribers()
export class ProductFilterModal implements OnInit, CloseGuard, ModalComponent<ProductFilterModalContext> {
  public subscribers: any = {};
  context: ProductFilterModalContext;
  public filter:SlFilters = new SlFilters;


  constructor(
      public dialog: DialogRef<ProductFilterModalContext>,
      public userService: UserService,
      public accountService: AccountService
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit(){
  }

  dismissModal(){
    this.dialog.dismiss();
  }

  closeModal(data){
    this.dialog.close(data);
  }
  
  triggerFilterChange(){
    console.log(this.filter);
    //this.context.callback(this.filter);
  }
}
