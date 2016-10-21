import { Component, OnInit } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

import { AccountService, ToasterService, UserService, PhoneMaskService } from '../../../core/services/index';
import { LocationModel } from '../../../models/index';

export class LocationModalContext extends BSModalContext {
  public location: any;
}

@Component({
  selector: 'app-location-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.scss']
})
export class LocationModal implements OnInit, CloseGuard, ModalComponent<LocationModalContext> {
  context: LocationModalContext;
  public location: LocationModel;
  public stateArr = {};
  public typeArr = {};
  public typeDirty: boolean = false;
  public stateDirty: boolean = false;
  public locationFormPhone: string = null;
  public locationFormFax: string = null;
  public phoneMask: any = this.phoneMaskService.defaultTextMask;
  // default country for phone input
  public selectedCountry: any = this.phoneMaskService.defaultCountry;
  public selectedFaxCountry: any = this.phoneMaskService.defaultCountry;

  uploadedImage;
  fileIsOver: boolean = false;
  options = {
    readAs: 'DataURL'
  };

  constructor(
      public dialog: DialogRef<LocationModalContext>,
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
      this.uploadedImage = this.location.image;

      this.locationFormPhone = this.phoneMaskService.getPhoneByIntlPhone(this.location.phone);
      this.selectedCountry = this.phoneMaskService.getCountryArrayByIntlPhone(this.location.phone);

      this.locationFormFax = this.phoneMaskService.getPhoneByIntlPhone(this.location.fax);
      this.selectedFaxCountry = this.phoneMaskService.getCountryArrayByIntlPhone(this.location.fax);
    }
    
    this.stateArr = this.accountService.stateCollection || null;
    this.typeArr = this.accountService.locationTypeCollection || null;
  }

  closeModal(){
    this.dialog.dismiss();
  }

  changeState(){
    this.stateDirty = true;
  }

  changeType(){
    this.typeDirty = true;
  }

  onCountryChange($event) {
    this.selectedCountry = $event;
  }

  onFaxCountryChange($event) {
    this.selectedFaxCountry = $event;
  }

  // upload by input type=file
  changeListener($event) : void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.uploadedImage = myReader.result;
    };
    myReader.readAsDataURL(file);
  }

  // upload by filedrop
  fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }

  onFileDrop(file: File): void {
    this.uploadedImage = file;
  }

  onSubmit(){
    this.location.account_id = this.userService.selfData.account_id;
    this.location.phone = this.selectedCountry[2] + ' ' + this.locationFormPhone;
    this.location.fax = this.locationFormFax ?  this.selectedFaxCountry[2] + ' ' + this.locationFormFax : null;
    this.location.image = this.uploadedImage;
    this.accountService.addLocation(this.location).subscribe(
      (res: any) => {
        this.closeModal();
      }
    );
  }
}
