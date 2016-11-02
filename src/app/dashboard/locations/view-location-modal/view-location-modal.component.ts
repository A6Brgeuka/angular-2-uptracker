import { Component, OnInit } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { AccountService, ToasterService, UserService, PhoneMaskService } from '../../../core/services/index';
import { LocationModel } from '../../../models/index';

export class ViewLocationModalContext extends BSModalContext {
  public location: any;
}

@Component({
  selector: 'app-view-location-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './view-location-modal.component.html',
  styleUrls: ['./view-location-modal.component.scss']
})
@DestroySubscribers()
export class ViewLocationModal implements OnInit, CloseGuard, ModalComponent<ViewLocationModalContext> {
  private subscribers: any = {};
  context: ViewLocationModalContext;
  public location: LocationModel;
  public locationFormPhone: string = null;
  public locationFormFax: string = null;
  public phoneMask: any = this.phoneMaskService.defaultTextMask;
  // default country for phone input
  public selectedCountry: any = this.phoneMaskService.defaultCountry;
  public selectedFaxCountry: any = this.phoneMaskService.defaultCountry;
  public uploadedImage: string;

  constructor(
      public dialog: DialogRef<ViewLocationModalContext>,
      private toasterService: ToasterService,
      private userService: UserService,
      private accountService: AccountService,
      private phoneMaskService: PhoneMaskService
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
    this.location = new LocationModel();
  }

  ngOnInit(){
    let locationData = this.context.location || {};
    this.location = new LocationModel(locationData);
    if (this.context.location){
      this.location.street_1 = this.location.address.street_1;
      this.location.street_2 = this.location.address.street_2;
      this.location.city = this.location.address.city;
      this.location.zip_code = this.location.address.postal_code;
      this.location.state = this.location.address.state;

      this.locationFormPhone = this.phoneMaskService.getPhoneByIntlPhone(this.location.phone);
      this.selectedCountry = this.phoneMaskService.getCountryArrayByIntlPhone(this.location.phone);

      this.locationFormFax = this.phoneMaskService.getPhoneByIntlPhone(this.location.fax);
      this.selectedFaxCountry = this.phoneMaskService.getCountryArrayByIntlPhone(this.location.fax);
    }
  }

  dismissModal(){
    this.dialog.dismiss();
  }

  closeModal(data){
    this.dialog.close(data);
  }

  editLocation(location = null){
    this.closeModal(location);
  }
}
