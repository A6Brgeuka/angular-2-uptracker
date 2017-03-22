import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Location }                 from '@angular/common';

import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import * as _ from 'lodash';

import {
  AccountService,
  ToasterService,
  UserService,
  PhoneMaskService,
  VendorService
} from '../../../core/services/index';
import { AccountVendorModel } from '../../../models/index';
import { ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss']
})
@DestroySubscribers()
export class EditVendorComponent implements OnInit, AfterViewInit {
  private subscribers: any = {};
  public vendor: AccountVendorModel;
  public vendorData: any;
  private formData: FormData = new FormData();
  public currency$: Observable<any>;
  public currencyArr: any;
  public currencyDirty: boolean = false;
  public currencySign: string = '$';
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
  public viewInit$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public vendorLoaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private fileArr: any = [];
  private oldFileArr: any = [];
  
  public locations$: Observable<any>;
  public currentLocation: any;
  public sateliteLocationActive: boolean = false;
  public primaryLocation: any;
  public secondaryLocation: any;
  public secondaryLocationArr: any = [];
  
  @ViewChild('secondary') secondaryLocationLink: ElementRef;
  
  private defaultPlaceholder: any = {
    discount_percentage: "Enter Value",
    shipping_handling: "Enter Value",
    avg_lead_time: "Enter Value",
    ext_account_number: "Enter Value",
    rep_name: "Enter full name",
    rep_email: "username@email.com",
    vendorFormPhone: "Enter phone number",
    vendorFormPhone2: "Enter phone number",
    vendorFormFax: "Enter fax number",
    notes: ""
  };
  public placeholder: any = {};
  private vendorId: string;
  
  constructor(
    private userService: UserService,
    private accountService: AccountService,
    private location: Location,
    private vendorService: VendorService,
    private route: ActivatedRoute,
    private phoneMaskService: PhoneMaskService
  ) {
    this.vendor = new AccountVendorModel({});
  }
  
  ngOnInit() {
    Observable.combineLatest(
      this.route.params,
      this.vendorService.getAccountVendors()
    )
    .map(([r,v]:any) =>_.filter(v, {'vendor_id': r['id']}))
    .filter(r=>!_.isEmpty(r))
    .subscribe(vendors => {
      this.vendorData = vendors;
      this.vendorData['vendor_id'] = vendors[0]['vendor_id'];
      this.vendorId = vendors[0]['vendor_id'];
      this.vendorLoaded$.next(true);
      //this.vendor = new AccountVendorModel(vendors);
      
    });
    
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
    
    this.locations$ = this.accountService.locations$
    .map((res: any) => {
      this.primaryLocation = _.find(res, {'location_type': 'Primary'}) || res[0];
      this.secondaryLocationArr = _.filter(res, (loc) => {
        return this.primaryLocation != loc;
      });
      if (this.secondaryLocationArr.length > 0)
        this.secondaryLocation = this.secondaryLocationArr[0];
      return this.secondaryLocationArr;
    });
    
    Observable
    .combineLatest(this.viewInit$, this.vendorLoaded$)
    .filter(([a, b]) => (a && b))
    .subscribe(() => this.initTabs());
  }
  
  initTabs() {
    // this.secondaryLocationLink.nativeElement.click();
    
    this.subscribers.dashboardLocationSubscription = this.accountService.dashboardLocation$.subscribe((res: any) => {
      this.chooseTabLocation(res);
      if (this.secondaryLocationArr.length == 1) return;
      if (res ? res.id != this.primaryLocation.id : null) {
        this.secondaryLocationLink.nativeElement.click();
      }
    });
    
    // observer to detect class change
    if (this.secondaryLocationLink) {
      let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation: any) => {
          if (this.vendorData && mutation.attributeName === "class" && mutation.oldValue == 'active' && mutation.target.className == '') {
            this.chooseTabLocation(this.secondaryLocation);
          }
        });
      });
      observer.observe(this.secondaryLocationLink.nativeElement, {
        attributes: true,
        attributeOldValue: true
      });
    }
  }
  
  ngAfterViewInit() {
    this.viewInit$.next(true);
  }
  
  chooseTabLocation(location = null){
    // set placeholders
    if (location) {
      let allLocationsVendor = _.find(_.cloneDeep(this.vendorData), {'location_id': null}) || {};
      _.each(this.defaultPlaceholder, (value, key) => {
        switch(key){
          case 'rep_office_phone': this.placeholder.vendorFormPhone = this.phoneMaskService.getPhoneByIntlPhone(allLocationsVendor[key]); break;
          case 'rep_mobile_phone': this.placeholder.vendorFormPhone2 = this.phoneMaskService.getPhoneByIntlPhone(allLocationsVendor[key]); break;
          case 'rep_fax': this.placeholder.vendorFormFax = this.phoneMaskService.getPhoneByIntlPhone(allLocationsVendor[key]); break;
          case 'discount_percentage': allLocationsVendor[key] = allLocationsVendor[key]*100; break;
        }
        this.placeholder[key] = allLocationsVendor[key] || this.defaultPlaceholder[key];
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
    let currentVendor = _.find(_.cloneDeep(this.vendorData), {'location_id': this.currentLocation ? this.currentLocation.id : null});
    this.fillForm(currentVendor);
  }
  
  fillForm(vendor = {}) {
    
    this.oldFiles$.next(null);
    this.newFiles$.next(null);
    this.vendorFormPhone = null;
    this.vendorFormPhone2 = null;
    this.vendorFormFax = null;
    this.vendor = new AccountVendorModel(vendor);
    this.calcPriorityMargin(this.vendor.priority);
    
    if (this.vendor.id) {
      this.vendor.discount_percentage = this.vendor.discount_percentage ? this.vendor.discount_percentage * 100 : null;
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
  
  changeCurrency(event) {
    let value = event.target.value;
    let currency = _.find(this.currencyArr, {'iso_code': value});
    this.currencyDirty = true;
    this.currencySign = currency ? currency['html_entity'] : '$';
  }
  
  changePriority(event) {
    let value = event.target.value;
    this.calcPriorityMargin(value);
  }
  
  calcPriorityMargin(value) {
    let fixer: number = -16;
    this.priorityMargin = 'calc(' + (value - 1) * 100 / 9 + '% + ' + fixer + 'px)';
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
    let myReader: any = new FileReader();
    myReader.fileName = file.name;
    this.addFile(file);
  }
  
  addFile(file) {
    this.fileArr.push(file);
    this.newFiles$.next(this.fileArr);
  }
  
  onSubmit() {
    
    this.vendor.account_id = this.userService.selfData.account_id;
    this.vendor.rep_office_phone = this.vendorFormPhone ? this.selectedCountry[2] + ' ' + this.vendorFormPhone : null;
    this.vendor.rep_mobile_phone = this.vendorFormPhone2 ? this.selectedCountry2[2] + ' ' + this.vendorFormPhone2 : null;
    this.vendor.rep_fax = this.vendorFormFax ? this.selectedFaxCountry[2] + ' ' + this.vendorFormFax : null;
    this.vendor.documents = null;
    this.vendor.location_id = this.currentLocation ? this.currentLocation.id : null;
    this.vendor.vendor_id = this.vendorId;
    
    _.each(this.vendor, (value, key) => {
      if (value != null || key == 'location_id')
        this.formData.append(key, value);
    });
    
    // append new files
    let i = 0;
    _.each(this.fileArr, (value, key) => {
      this.formData.append('new_documents[' + i + ']', this.fileArr[i]);
      i++;
    });
    
    
    // append old files
    let j = 0;
    _.each(this.fileArr, (value, key) => {
      this.formData.append('documents[' + j + ']', this.oldFileArr[j]);
      j++;
    });
    
    this.vendorService.editAccountVendor(this.vendor, this.formData).subscribe(
      (res: any) => {
        this.goBack();
      }
    );
  }
  
  goBack(): void {
    this.location.back();
  }
  
}
