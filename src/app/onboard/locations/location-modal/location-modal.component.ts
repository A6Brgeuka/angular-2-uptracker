import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

import { AccountService, ToasterService, UserService } from '../../../core/services/index';
import { LocationModel } from '../../../models/index';

export class LocationModalContext extends BSModalContext {
}

/**
 * A Sample of how simple it is to create a new window, with its own injects.
 */
@Component({
  selector: 'app-location-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.scss']
})
export class LocationModal implements CloseGuard, ModalComponent<LocationModalContext> {
  context: LocationModalContext;
  location: LocationModel;
  selectedType = '';
  selectedState = '';
  stateArr = {};
  typeArr = {};
  typeDirty: boolean = false;
  stateDirty: boolean = false;
  locationFormPhone: string = null;
  locationFormFax: string = null;
  public phoneMask: any = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/ ];
  // default country for phone input
  selectedCountry: any = [ "United States", "us", "1", 0 ];
  selectedFaxCountry: any = [ "United States", "us", "1", 0 ];

  uploadedImage;
  fileIsOver: boolean = false;
  options = {
    readAs: 'DataURL'
  };

  constructor(
      public router: Router,
      private activatedRoute: ActivatedRoute,
      public dialog: DialogRef<LocationModalContext>,
      private toasterService: ToasterService,
      private userService: UserService,
      private accountService: AccountService
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
    this.location = new LocationModel();
  }

  ngOnInit(){
    this.stateArr = this.accountService.stateCollection || null;
    this.typeArr = this.accountService.locationTypeCollection || null;
  }

  closeModal(){
    this.dialog.close();
  }

  // TODO: remove if not necessary
  // lifecycle functions
  // beforeDismiss(): boolean {
  //   return true;
  // }
  //
  // beforeClose(): boolean {
  //   return true;
  // }

  changeState(){
    this.stateDirty = true;
  }

  changeType(){
    this.typeDirty = true;
  }

  onCountryChange($event) {
    // TODO: change phone mask dynamically if necessary
    // this.phoneMask = [ /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/ ];
    // let codeArr = country[2].split('');
    // codeArr.unshift('+');
    // codeArr.push(' ', ' ');
    // this.phoneMask = codeArr.concat(this.phoneMask);
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
    this.location.location_type = this.selectedType;
    this.location.state = this.selectedState;
    this.location.phone = this.selectedCountry[2] + ' ' + this.locationFormPhone;
    this.location.fax = this.selectedFaxCountry[2] + ' ' + this.locationFormFax;
    this.location.image = this.uploadedImage;
    this.accountService.addLocation(this.location).subscribe(
        (res: any) => {
          let user = this.userService.selfData;
          user.account = res.data.account;
          this.userService.updateSelfData(user);
          this.closeModal();
        }
    );
  }
}
