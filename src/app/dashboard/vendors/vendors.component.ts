import {Component, OnInit, ViewContainerRef} from "@angular/core";
import { Observable, BehaviorSubject, Subject } from "rxjs/Rx";
import {Overlay} from "angular2-modal";
import {Modal} from "angular2-modal/plugins/bootstrap";
import {DestroySubscribers} from "ng2-destroy-subscribers";
import * as _ from "lodash";
import {ViewVendorModal} from "./view-vendor-modal/view-vendor-modal.component";
import {EditVendorModal} from "./edit-vendor-modal/edit-vendor-modal.component";
import {VendorService, ModalWindowService} from "../../core/services/index";
import { HostListener } from "@angular/core/src/metadata/directives";


@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
@DestroySubscribers()
export class VendorsComponent implements OnInit {
  private searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public  searchKey:string;
  public sortBy: string;
  private sortBy$: any = new BehaviorSubject(null);
  public total: number;
  public vendors$: Observable<any>;
  public vendors: any;

  public infiniteScroll$: any = new BehaviorSubject(false);
  public isRequestVendors = false;

  constructor(
      private vcRef: ViewContainerRef,
      overlay: Overlay,
      public modal: Modal,
      private vendorService: VendorService,
      private modalWindowService: ModalWindowService
  ) {
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
    
    this.vendorService.totalCount$.subscribe(res => {this.total = res});

      this.infiniteScroll$
      .filter((infinite)=>infinite && !this.isRequestVendors)
      .switchMap((infinite) => {
        this.isRequestVendors = true;
        return this.vendorService.getNextVendors(this.vendorService.lastId, this.searchKey);
      })
      .subscribe(res => {
        this.isRequestVendors = false;

      },err => {
        this.isRequestVendors = false;
      });


    this.vendors$ = Observable
        .combineLatest(
            this.vendorService.combinedVendors$,
            this.sortBy$,
            this.searchKey$,
          
        )
        .map(([vendors, sortBy, searchKey]) => {
          console.log(vendors);
          let filteredVendors = vendors;
          if (searchKey && searchKey!='') {
            filteredVendors = _.reject(filteredVendors, (vendor: any) =>{
              let key = new RegExp(searchKey, 'i');
              return !key.test(vendor.name);
            });
          }
          let order = 'desc';
          if (sortBy == 'A-Z') {
            sortBy = 'name';
            order = 'asc';
          }
          if (sortBy == 'Z-A') {
            sortBy = 'name';
          }

          this.getInfiniteScroll();

          let sortedVendors = _.orderBy(filteredVendors, [sortBy], [order]);
          this.vendors = sortedVendors;
          return sortedVendors;
        }).debounce((x)=>Observable.timer(1000));
  
    
    
  }

  ngAfterViewInit() {
    this.getInfiniteScroll();
  }

  viewVendorModal(vendor = null){
    let data = { vendor: vendor, keyboard: [] };
    this.modalWindowService.customModal(this.vcRef, ViewVendorModal, data, this.editVendorModal.bind(this));
  }

  editVendorModal(vendor){
    let accountVendors: any = vendor.account_vendor;
    accountVendors.vendor_id = vendor.id;


    //check local vendor or global, to make edit from viewVendorModal to editVendorModel work
    if(vendor.vendor_id) {
      let globalVendor: any = _.find(this.vendors, {id: vendor.vendor_id});
      accountVendors = globalVendor.account_vendor;
      accountVendors.vendor_id = globalVendor.id;
    }


    let data = { vendor: accountVendors, keyboard: [] };
    this.modalWindowService.customModal(this.vcRef, EditVendorModal, data);
  }

  vendorsFilter(event){
    // replace forbidden characters
    let value = event.target.value;
    this.vendorService.getVendors(value).take(1);
  }

  vendorsSort(event) {
    let value = event.target.value;
    this.sortBy$.next(value);
  }

  requestVendor(){

  }

  getInfiniteScroll() {
    let scrollBottom = document.body.scrollHeight - document.body.scrollTop - window.innerHeight < 285;
    // let widthColumns = document.body.scrollHeight - document.body.scrollTop - window.innerWidth < 300;
    this.infiniteScroll$.next(scrollBottom);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    this.getInfiniteScroll();
  }


}
