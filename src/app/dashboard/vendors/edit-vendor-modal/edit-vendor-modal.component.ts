import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import * as _ from 'lodash';

import { AccountService, ToasterService, UserService, PhoneMaskService, VendorService } from '../../../core/services/index';
import { VendorModel, AccountVendorModel } from '../../../models/index';

export class EditVendorModalContext extends BSModalContext {
  public vendor: any;
}

@Component({
  selector: 'app-edit-vendor-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './edit-vendor-modal.component.html',
  styleUrls: ['./edit-vendor-modal.component.scss']
})
@DestroySubscribers()
export class EditVendorModal implements OnInit, CloseGuard, ModalComponent<EditVendorModalContext> {
  private subscribers: any = {};
  private context: EditVendorModalContext;
  public vendor: any;
  public currency$: Observable<any>;
  public currencyArr: any;
  public currencyDirty: boolean = false;
  public currencySign: string ='$';
  public amountMask: any = createNumberMask({
    allowDecimal: false,
    prefix: ''
  });
  public discountMask: any = [/\d/, /\d/, /\d/];
  public priorityMargin: string = '0';
  
  public vendorFormPhone: string = null;
  public vendorFormPhone2: string = null;
  public vendorFormFax: string = null;
  public phoneMask: any = this.phoneMaskService.defaultTextMask;
  // default country for phone input
  public selectedCountry: any = this.phoneMaskService.defaultCountry;
  public selectedCountry2: any = this.phoneMaskService.defaultCountry;
  public selectedFaxCountry: any = this.phoneMaskService.defaultCountry;

  fileIsOver: boolean = false;
  options = {
    readAs: 'DataURL'
  };

  constructor(
      public dialog: DialogRef<EditVendorModalContext>,
      private toasterService: ToasterService,
      private userService: UserService,
      private accountService: AccountService,
      private vendorService: VendorService,
      private phoneMaskService: PhoneMaskService
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit(){    
    // this.vendor = this.context.vendor || new VendorModel();
    let vendorData = this.context.vendor || { currency: 'USD', priority: '1', default_order_type: 'email', payment_method: 'check' };
    this.vendor = new AccountVendorModel(vendorData);
    console.log(this.vendor);
    this.calcPriorityMargin(this.vendor.priority);
    // default values
    // this.vendor.currency = this.vendor.currency || 'USD';
    // this.vendor.priority = this.vendor.priority || '1';
    // this.calcPriorityMargin(this.vendor.priority);
    // this.vendor.default_order_type = this.vendor.default_order_type || 'email';
    // this.vendor.payment_method = this.vendor.payment_method || 'check';

    if (this.context.vendor){
      // this.vendor.discount_percentage = parseInt(this.context.vendor.discount_percentage * 100);
      this.vendorFormPhone = this.phoneMaskService.getPhoneByIntlPhone(this.vendor.rep_office_phone);
      this.selectedCountry = this.phoneMaskService.getCountryArrayByIntlPhone(this.vendor.rep_office_phone);
      this.vendorFormPhone2 = this.phoneMaskService.getPhoneByIntlPhone(this.vendor.rep_mobile_phone);
      this.selectedCountry2 = this.phoneMaskService.getCountryArrayByIntlPhone(this.vendor.rep_mobile_phone);
      this.vendorFormFax = this.phoneMaskService.getPhoneByIntlPhone(this.vendor.rep_fax);
      this.selectedFaxCountry = this.phoneMaskService.getCountryArrayByIntlPhone(this.vendor.rep_fax);
    }
    
    this.currency$ = this.accountService.getCurrencies().map((res: any) => {
      this.currencyArr = _.sortBy(res.data, 'priority');
      return this.currencyArr;
    });
  }

  closeModal(){
    this.dialog.dismiss();
  }

  changeCurrency(event){
    let value = event.target.value;
    let currency = _.find(this.currencyArr, {'iso_code': value});
    this.currencyDirty = true;
    this.currencySign = currency ? currency['html_entity'] : '$';
  }

  changePriority(event){
    let value = event.target.value;
    this.calcPriorityMargin(value);
  }

  calcPriorityMargin(value){
    let fixer: number;
    switch (value){
      case '1': fixer = 12; break;
      case '2': fixer = 12; break;
      case '3': fixer = 12; break;
      case '4': fixer = 11; break;
      case '5': fixer = 12; break;
      case '6': fixer = 11; break;
      case '7': fixer = 11; break;
      case '8': fixer = 10; break;
      case '9': fixer = 9; break;
      case '10': fixer = 6; break;
      default: fixer = 10;
    }
    this.priorityMargin = 'calc(' + (value - 1)*10 + '% + ' + fixer + 'px)';
  }

  onCountryChange($event) {
    this.selectedCountry = $event;
  }

  onCountryChange2($event) {
    this.selectedCountry2 = $event;
  }

  onFaxCountryChange($event) {
    this.selectedFaxCountry = $event;
  }

  // // upload by input type=file
  // changeListener($event): void {
  //   this.readThis($event.target);
  // }
  //
  // readThis(inputValue: any): void {
  //   var file: File = inputValue.files[0];
  //   var myReader: FileReader = new FileReader();
  //
  //   myReader.onloadend = (e) => {
  //     this.onFileDrop(myReader.result);
  //   };
  //   myReader.readAsDataURL(file);
  // }
  //
  // // upload by filedrop
  // fileOver(fileIsOver: boolean): void {
  //   this.fileIsOver = fileIsOver;
  // }
  //
  // onFileDrop(file: File): void {
  //   let img: any = this.fileUploadService.resizeImage(file, {resizeMaxHeight: 586, resizeMaxWidth: 1040});
  //   let orientation = this.fileUploadService.getOrientation(file);
  //   let img2 = this.fileUploadService.getOrientedImageByOrientation(img, orientation);
  //
  //   // this.uploadedImage = img2.src;
  // }

  onSubmit(){
    this.vendor.account_id = this.userService.selfData.account_id;
    this.vendor.rep_office_phone = this.selectedCountry[2] + ' ' + this.vendorFormPhone;
    this.vendor.rep_mobile_phone = this.vendorFormPhone2 ? this.selectedCountry2[2] + ' ' + this.vendorFormPhone2 : null;
    this.vendor.rep_fax = this.vendorFormFax ?  this.selectedFaxCountry[2] + ' ' + this.vendorFormFax : null;

    this.vendorService.addAccountVendor(this.vendor).subscribe(
        (res: any) => {
          this.closeModal();
        }
    );
  }
}
