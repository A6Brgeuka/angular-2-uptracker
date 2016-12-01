import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

import { VendorModel, LocationModel } from '../../../models/index';
import { UserService, AccountService, ModalWindowService } from '../../../core/services/index';

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
  public vendor: any = {};
  private accountVendors: any;
  public locationArr: any = [];
  public locations$: Observable<any>;
  public currentLocation: any;
  public sateliteLocationActive: boolean = false;
  public primaryLocation: any;
  public secondaryLocation: any = { name: 'Satelite Location' };

  @ViewChild('secondary') secondaryLocationLink: ElementRef;

  constructor(
      public dialog: DialogRef<ViewVendorModalContext>,
      public userService: UserService,
      public accountService: AccountService,
      private modalWindowService: ModalWindowService
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit(){
    this.accountVendors = this.context.vendor.account_vendor;
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
      this.chooseTabLocation(res);
      if (res && res.id != this.primaryLocation.id){
        this.secondaryLocationLink.nativeElement.click();
      }
    });
  }

  dismissModal(){
    this.dialog.dismiss();
    this.modalWindowService.setScrollPosition();
  }

  closeModal(data){
    this.dialog.close(data);
  }

  editVendor(vendor = null){
    this.accountService.dashboardLocation$.next(this.currentLocation);
    this.closeModal(vendor);
  }

  chooseTabLocation(location = null){
    if (location && location != this.primaryLocation) {
      this.sateliteLocationActive = true;
      this.secondaryLocation = location;
    } else {
      this.sateliteLocationActive = false;
    }
    this.currentLocation = new LocationModel(location);

    // fill vendor info for modal view vendor
    this.vendor = new VendorModel(this.context.vendor);
    let locationAccountVendor = _.find(this.accountVendors, {'location_id': this.currentLocation.id});
    _.each(locationAccountVendor, (value, key) => {
      if (value)
          this.vendor[key] = value;
    });
  }
}
