import { Component, OnInit } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { VendorModel } from '../../../models/index';
import { UserService } from '../../../core/services/index';

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
export class ViewVendorModal implements OnInit, CloseGuard, ModalComponent<ViewVendorModalContext> {
  subscribers: any;
  context: ViewVendorModalContext;
  public vendor: VendorModel;
  public locationArr: any = [];
  public currentLocation: any = {
    name: 'Satelite Location'
  };
  public sateliteLocationActive: boolean = false;

  constructor(
      public dialog: DialogRef<ViewVendorModalContext>,
      public userService: UserService
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit(){
    this.vendor = new VendorModel(this.context.vendor);
    this.subscribers = this.userService.selfData$
        .filter(() => {
          return !this.userService.isGuest();
        })
        .subscribe((res: any) => {
          this.locationArr = res.account.locations;
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

  chooseLocation(location){
    this.sateliteLocationActive = true;
    this.currentLocation = location;
  }


}
