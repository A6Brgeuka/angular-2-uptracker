import { Component, OnInit } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

import { UserService, AccountService, PhoneMaskService } from '../../../core/services/index';
import { UserModel } from '../../../models/index';

export class UserModalContext extends BSModalContext {
  public user: any;
}

@Component({
  selector: 'app-user-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModal implements OnInit, CloseGuard, ModalComponent<UserModalContext> {
  context: UserModalContext;
  public user: any;
  public selectedPermission = '';
  public locationArr: any;
  public departmentArr: any;
  public permissionArr: any;
  public locationDirty: boolean = false;
  public departmentDirty: boolean = false;
  public permissionDirty: boolean = false;
  public profileFormPhone: string = null;
  // default country for phone input
  public selectedCountry: any = this.phoneMaskService.defaultCountry;
  public phoneMask: any = this.phoneMaskService.defaultTextMask;
  public preset: any = [];

  uploadedImage;
  fileIsOver: boolean = false;
  options = {
    readAs: 'DataURL'
  };

  constructor(
      public dialog: DialogRef<UserModalContext>,
      private userService: UserService,
      private accountService: AccountService,
      private phoneMaskService: PhoneMaskService
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit(){
    let userData = this.context.user || { tutorial_mode: true };
    this.user = new UserModel(userData);
    if (this.context.user){
      this.uploadedImage = this.user.avatar;

      this.profileFormPhone = this.phoneMaskService.getPhoneByIntlPhone(this.user.phone);
      this.selectedCountry = this.phoneMaskService.getCountryArrayByIntlPhone(this.user.phone);
    }
    this.locationArr = this.userService.selfData.account.locations;
    this.departmentArr = this.accountService.departmentCollection;
    this.preset = [false, true, false];
  }

  closeModal(){
    this.dialog.close();
  }

  changeLocation(){
    this.locationDirty = true;
  }

  changeDepartment(){
    this.departmentDirty = true;
  }

  changePermission(){
    this.permissionDirty = true;
  }

  onCountryChange($event) {
    this.selectedCountry = $event;
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

  toggleTutorialMode(){
    this.user.tutorial_mode = !this.user.tutorial_mode;
  }

  togglePreset(i){
    this.preset[i] = !this.preset[i];
  }

  onSubmit(){
    this.user.account_id = this.userService.selfData.account_id;
    this.user.phone = this.selectedCountry[2] + ' ' + this.profileFormPhone;
    this.user.avatar = this.uploadedImage;
    debugger;
    // this.accountService.addUser(this.user).subscribe(
    //     (res: any) => {
    //       // let user = this.userService.selfData;
    //       // user.account = res.data.account;
    //       // this.userService.updateSelfData(user);
    //       this.closeModal();
    //     }
    // );
  }
}
