import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import * as _ from 'lodash';

import { AccountService, ToasterService, UserService, PhoneMaskService, VendorService } from '../../../core/services/index';
import { AccountVendorModel } from '../../../models/index';

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
export class EditVendorModal implements OnInit, AfterViewInit, CloseGuard, ModalComponent<EditVendorModalContext> {
  private subscribers: any = {};
  private context: EditVendorModalContext;
  public vendor: AccountVendorModel;
  private formData: FormData = new FormData();
  public currency$: Observable<any>;
  public currencyArr: any;
  public currencyDirty: boolean = false;
  public currencySign: string ='$';
  public amountMask: any = createNumberMask({
    allowDecimal: true,
    prefix: ''
  });
  public discountMask: any = this.amountMask; //[/\d/, /\d/, /\d/];
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
  public files$: Observable<any>;
  public newFiles$: BehaviorSubject<any> = new BehaviorSubject(null);
  public oldFiles$: BehaviorSubject<any> = new BehaviorSubject(null);
  private fileArr: any = [];
  private oldFileArr: any = [];

  public locations$: Observable<any>;
  public currentLocation: any;
  public sateliteLocationActive: boolean = false;
  public primaryLocation: any;
  public secondaryLocation: any = { name: 'Satelite Location' };

  @ViewChild('secondary') secondaryLocationLink: ElementRef;

  private defaultPlaceholder: any = {
    discount_percentage: "Enter Value",
    shipping_handling: "Enter Value",
    avg_lead_time: "Enter Value",
    rep_name: "Enter full name",
    rep_email: "username@email.com",
    vendorFormPhone: "Enter phone number",
    vendorFormPhone2: "Enter phone number",
    vendorFormFax: "Enter fax number",
    notes: ""
  };
  public placeholder: any = {};

  constructor(
      public dialog: DialogRef<EditVendorModalContext>,
      private userService: UserService,
      private accountService: AccountService,
      private vendorService: VendorService,
      private phoneMaskService: PhoneMaskService
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit(){
    this.vendor = new AccountVendorModel();

    this.currency$ = this.accountService.getCurrencies().do((res: any) => {
      this.currencyArr = res;
    });

    this.files$ = Observable.combineLatest(
        this.newFiles$,
        this.oldFiles$,
        (newFiles, oldFiles) => {
          let files = _.union(oldFiles, newFiles);
          return files;
        }
    );

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

  chooseTabLocation(location = null){
    // set placeholders
    if (location) {
      let allLocationsVendor = _.find(_.cloneDeep(this.context.vendor), {'location_id': null}) || {};
      _.each(allLocationsVendor, (value, key) => {
        key == 'discount_percentage' ? allLocationsVendor[key] = value*100 : allLocationsVendor[key] = value;
        switch(key){
          case 'rep_office_phone': this.placeholder.vendorFormPhone = this.phoneMaskService.getPhoneByIntlPhone(value); break;
          case 'rep_mobile_phone': this.placeholder.vendorFormPhone2 = this.phoneMaskService.getPhoneByIntlPhone(value); break;
          case 'rep_fax': this.placeholder.vendorFormFax = this.phoneMaskService.getPhoneByIntlPhone(value); break;
        }
        this.placeholder[key] = value || this.defaultPlaceholder[key];
      });
    } else {
      this.placeholder = this.defaultPlaceholder;
    }

    // check if secondary location was chosen
    if (location && location != this.primaryLocation) {
      this.sateliteLocationActive = true;
      this.secondaryLocation = location;
    } else {
      this.sateliteLocationActive = false;
    }

    this.currentLocation = location;
    let currentVendor = _.find(_.cloneDeep(this.context.vendor), {'location_id': this.currentLocation ? this.currentLocation.id : null});
    this.fillForm(currentVendor);
  }

  fillForm(vendor){
    this.oldFiles$.next(null);
    this.newFiles$.next(null);
    this.vendorFormPhone = null;
    this.vendorFormPhone2 = null;
    this.vendorFormFax = null;
    let vendorData = vendor || {};
    this.vendor = new AccountVendorModel(vendorData);
    this.calcPriorityMargin(this.vendor.priority);

    if (this.vendor.id){
      this.vendor.discount_percentage *= 100;
      this.oldFileArr = this.vendor.documents;
      this.oldFiles$.next(this.oldFileArr);

      this.vendorFormPhone = this.phoneMaskService.getPhoneByIntlPhone(this.vendor.rep_office_phone);
      this.selectedCountry = this.phoneMaskService.getCountryArrayByIntlPhone(this.vendor.rep_office_phone);
      this.vendorFormPhone2 = this.phoneMaskService.getPhoneByIntlPhone(this.vendor.rep_mobile_phone);
      this.selectedCountry2 = this.phoneMaskService.getCountryArrayByIntlPhone(this.vendor.rep_mobile_phone);
      this.vendorFormFax = this.phoneMaskService.getPhoneByIntlPhone(this.vendor.rep_fax);
      this.selectedFaxCountry = this.phoneMaskService.getCountryArrayByIntlPhone(this.vendor.rep_fax);
    }
  }

  dismissModal(){
    this.dialog.dismiss();
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
    value = parseInt(value);
    switch (value){
      case 1: fixer = 13; break;
      case 2: fixer = 12; break;
      case 3: fixer = 12; break;
      case 4: fixer = 11; break;
      case 5: fixer = 12; break;
      case 6: fixer = 11; break;
      case 7: fixer = 11; break;
      case 8: fixer = 10; break;
      case 9: fixer = 10; break;
      case 10: fixer = 6; break;
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

  // upload by input type=file
  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    let file: File = inputValue.files[0];
    this.onFileDrop(file);
  }

  // upload by filedrop
  fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }
  
  onFileDrop(file: any): void {
    // TODO: remove after testing
    // let fileData = file.split(',')[1];
    // let dataType = file.split('.')[0].split(';')[0].split(':')[1];
    // let binaryImageData = atob(fileData);
    // let blob = new Blob([binaryImageData], { type: dataType });

    let myReader: any = new FileReader();
    myReader.fileName = file.name;
    this.addFile(file);
  }

  addFile(file){
    // TODO: Remove after testing
    // this.formData.append('documents[]', file);
    this.fileArr.push(file);
    this.newFiles$.next(this.fileArr);
  }

  onSubmit(){
    this.vendor.account_id = this.userService.selfData.account_id;
    this.vendor.vendor_id = this.context.vendor.vendor_id;
    this.vendor.rep_office_phone = this.vendorFormPhone ? this.selectedCountry[2] + ' ' + this.vendorFormPhone : null;
    this.vendor.rep_mobile_phone = this.vendorFormPhone2 ? this.selectedCountry2[2] + ' ' + this.vendorFormPhone2 : null;
    this.vendor.rep_fax = this.vendorFormFax ?  this.selectedFaxCountry[2] + ' ' + this.vendorFormFax : null;
    this.vendor.documents = null;
    this.vendor.location_id = this.currentLocation ? this.currentLocation.id : null;

    _.each(this.vendor, (value, key) => {
      if (value != null)
        this.formData.append(key, value);
    });

    // append new files
    let i = 0;
    _.each(this.fileArr, (value, key) => {
      this.formData.append('new_documents['+i+']', this.fileArr[i]);
      i++;
    });

    // append old files
    let j = 0;
    _.each(this.fileArr, (value, key) => {
      this.formData.append('documents['+j+']', this.oldFileArr[j]);
      j++;
    });

    this.vendorService.editAccountVendor(this.vendor, this.formData).subscribe(
        (res: any) => {
          this.closeModal();
        }
    );
  }
}
