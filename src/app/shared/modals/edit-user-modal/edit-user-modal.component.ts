import { Component, OnInit } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as lodashFind from 'lodash/find';
import * as lodashClone from 'lodash/cloneDeep';
import * as lodashIsEqual from 'lodash/isEqual';
import * as lodashEach from 'lodash/each';

import { UserService, AccountService, PhoneMaskService, ToasterService } from '../../../core/services/index';
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
@DestroySubscribers()
export class UserModal implements OnInit, CloseGuard, ModalComponent<UserModalContext> {
  private subscribers: any = {};
  context: UserModalContext;
  public user: any;
  public locationArr: any;
  public departmentArr: any;
  public locationDirty: boolean = false;
  public departmentDirty: boolean = false;
  public profileFormPhone: string = null;
  // default country for phone input
  public selectedCountry: any = this.phoneMaskService.defaultCountry;
  public phoneMask: any = this.phoneMaskService.defaultTextMask;

  uploadedImage;
  fileIsOver: boolean = false;
  options = {
    readAs: 'DataURL'
  };

  public selectedRole = '';
  public customRole = 'custom';
  public permissionArr: any;
  public rolesArr: any;
  public roleDirty: boolean = false;
  public showCustomRole: boolean = false;
  public addPresetForm: boolean = false;
  public preset: any = {};

  constructor(
      public dialog: DialogRef<UserModalContext>,
      private userService: UserService,
      private accountService: AccountService,
      private phoneMaskService: PhoneMaskService,
      private toasterService: ToasterService
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit(){
    this.locationArr = this.userService.selfData.account.locations;
    let userData = this.context.user || { tutorial_mode: true };
    this.user = new UserModel(userData);
    if (this.context.user){ 
      this.uploadedImage = this.user.avatar;
      this.profileFormPhone = this.phoneMaskService.getPhoneByIntlPhone(this.user.phone);
      this.selectedCountry = this.phoneMaskService.getCountryArrayByIntlPhone(this.user.phone);
    }
    // set default location for new user or selfData (current user)
    if (!this.user.default_location || this.user.default_location == '') {
      let primaryLoc = lodashFind(this.locationArr, {'location_type': 'Primary'});
      let onlyLoc = this.locationArr.length == 1 ? this.locationArr[0]['id'] : null;
      this.user.default_location = primaryLoc ? primaryLoc['id'] : onlyLoc;
    }

    if (!this.user.template){
      this.user.template = this.userService.selfData.account.purchase_order_template;
    }

    this.subscribers.departmentCollection = this.accountService.getDepartments().subscribe((res) => {
      this.departmentArr = res.data;
    });

    this.subscribers.getRolesSubscription = this.userService.selfData$.subscribe((res: any) => {
      if (res.account) {
        this.rolesArr = res.account.roles;
        if (!this.context.user) {
          this.setDefaultPermissions();
        } else {
          if (this.user.permissions[0]){
            this.permissionArr = this.user.permissions;
            lodashEach(this.rolesArr, (roleItem) => {
              if (lodashIsEqual(roleItem.permissions, this.permissionArr)){
                this.selectedRole = roleItem.role;
              }
            });
          } else {
            this.setDefaultPermissions();
          }
        }
      }
    });
  }

  setDefaultPermissions(){
    this.permissionArr = lodashClone(this.rolesArr[0].permissions);
    this.permissionArr.map((data:any) => {
      data.default = false;
      return data;
    });
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

  changeRole(){
    this.roleDirty = true;
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

  onRoleChange(event: any = false){ 
    let newRole;
    if (event){
      newRole = event.target.value;
    } else {
      newRole = this.selectedRole;
    }
    lodashEach(this.rolesArr, (roleItem) => {
      if (roleItem.role == newRole){
        this.permissionArr = lodashClone(roleItem.permissions);
      }
    });
  }

  togglePreset(i){
    let z = 0;
    this.permissionArr[i].default = !this.permissionArr[i].default;
    lodashEach(this.rolesArr, (roleItem) => {
      if (lodashIsEqual(roleItem.permissions, this.permissionArr)){
        this.selectedRole = roleItem.role;
        this.showCustomRole = false;
        z++;
      }
    });
    // show role Custom if no matches
    if (z == 0){
      this.showCustomRole = true;
      this.selectedRole = 'custom';
    }
  }
  
  showAddPresetForm(){
    if (this.showCustomRole){
      this.addPresetForm = true;
    }
  }

  addRole(){
    if (!this.preset.role || this.preset.role == '') {
      this.toasterService.pop('error', 'Pre-set name is required');
      return;
    }
    this.preset.account_id = this.userService.selfData.account_id;
    this.preset.permissions = this.permissionArr;
    this.subscribers.addRoleSubscription = this.accountService.addRole(this.preset).subscribe((res: any) => { 
      lodashEach(res.data.roles, (roleItem: any) => {
        if (roleItem.label == this.preset.role) {
          this.selectedRole = roleItem.role;
        }
      });
      this.addPresetForm = false;
      this.preset = {};
      this.showCustomRole = false;
      this.onRoleChange();
    });
  }

  onSubmit(){
    this.user.account_id = this.userService.selfData.account_id;
    this.user.phone = this.selectedCountry[2] + ' ' + this.profileFormPhone;
    this.user.avatar = this.uploadedImage;
    this.user.permissions = this.permissionArr;
    this.subscribers.addUserSubscription = this.accountService.addUser(this.user).subscribe(
        (res: any) => {
          this.closeModal();
        }
    );
  }
}
