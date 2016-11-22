import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

import { VendorModel } from '../../../models/index';
import { UserService, AccountService } from '../../../core/services/index';

export class ViewVendorModalContext extends BSModalContext {
  public vendor: VendorModel;
}

@Component({
  selector: 'app-view-vendor-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './view-vendor-modal.component.html',
  styleUrls: ['./view-vendor-modal.component.scss']
})
@DestroySubscribers()
export class ViewVendorModal implements OnInit, AfterViewInit, CloseGuard, ModalComponent<ViewVendorModalContext> {
  private subscribers: any = {};
  context: ViewVendorModalContext;
  public vendor: VendorModel;
  public locationArr: any = [];
  public locations$: Observable<any>;
  public currentLocation: any;
  public sateliteLocationActive: boolean = false;
  public primaryLocation: any;
  public secondaryLocation: any;

  @ViewChild('secondary') secondaryLocationLink: ElementRef;

  constructor(
      public dialog: DialogRef<ViewVendorModalContext>,
      public userService: UserService,
      public accountService: AccountService
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit(){
    this.vendor = new VendorModel(this.context.vendor);
    this.locations$ = this.accountService.locations$.map((res: any) => {
      this.primaryLocation = _.find(res, {'location_type': 'Primary'}) || res[0];
      let secondaryLocations = _.filter(res, (loc) => {
        return this.primaryLocation != loc;
      });
      return secondaryLocations;
    });
  }

  ngAfterViewInit(){
    this.subscribers.dashboardLocationSubscription = this.accountService.dashboardLocation$.subscribe((res: any) => {
      this.secondaryLocation = res || { name: 'Satelite Location' };
      if (res){
        this.chooseLocation(res);
        this.secondaryLocationLink.nativeElement.click();
      }
    });
  }

  dismissModal(){
    this.dialog.dismiss();
  }

  closeModal(data){
    this.dialog.close(data);
  }

  editVendor(vendor = null){
    this.closeModal(vendor);
  }

  chooseLocation(location = null){
    if (location && location != this.primaryLocation) {
      this.sateliteLocationActive = true;
      this.secondaryLocation = location;
    } else {
      this.sateliteLocationActive = false;
    }
    this.currentLocation = location;
  }
}
