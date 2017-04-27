import { Component, OnInit, ViewContainerRef, HostListener } from "@angular/core";
import {Observable, BehaviorSubject, Subject} from "rxjs/Rx";
import {Overlay} from "angular2-modal";
import {Modal} from "angular2-modal/plugins/bootstrap";
import {DestroySubscribers} from "ng2-destroy-subscribers";
import * as _ from "lodash";
import {VendorService, ModalWindowService} from "../../core/services/index";


@Component({
    selector: 'app-vendors',
    templateUrl: './vendors.component.html',
    styleUrls: ['./vendors.component.scss']
})
@DestroySubscribers()
export class VendorsComponent implements OnInit {
    public searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    public  searchKey: string;
    public  searchKeyLast: string;
    public  sortBy: string = 'A-Z';
    public sortBy$: any = new BehaviorSubject(null);
    public  total: number;
    public  vendors$: Observable<any>;
    public  vendors: any;
    public  infiniteScroll$: any = new BehaviorSubject(false);
    public  isRequestVendors = true;
    public body = document.getElementsByTagName("body")[0];
    
    constructor(
      public modal: Modal,
      public vendorService: VendorService,
      public modalWindowService: ModalWindowService
    ) {
    }

    ngOnInit() {

        this.vendorService.isDataLoaded$
            .delay(500)
            .filter(r=>r)
            .subscribe((r)=>{
            this.isRequestVendors = false;
            this.getInfiniteScroll()
        });

        this.searchKey$.debounceTime(1000)
            .filter(r => (r || r === ''))
            .switchMap(r=>this.vendorService.getNextVendors(0, r, this.sortBy))
            .subscribe(
                (r) => {
                    this.vendorService.current_page = 1;
                }
            );
        this.sortBy$
            .filter(r => r)
            .switchMap(r=>this.vendorService.getNextVendors(0, this.searchKey, r))
            .subscribe(
              (r) => {
                  this.vendorService.current_page = 1;
              }
            );
        this.infiniteScroll$
            .filter((infinite) => {
                return infinite && !this.isRequestVendors/* && vendors.length*/
            })
            .switchMap((infinite) => {
            console.log('scroll');
                this.isRequestVendors = true;
                if (this.searchKey == this.searchKeyLast) {
                    ++this.vendorService.current_page;
                }
                this.searchKeyLast = this.searchKey;
                if (this.vendorService.total <= (this.vendorService.current_page-1) * this.vendorService.pagination_limit) {
                    return Observable.of({});
                } else {
                    
                    return this.vendorService.getNextVendors(this.vendorService.current_page, this.searchKey, this.sortBy);
                }
            })
                .subscribe(res => {
                this.isRequestVendors = false;
            }, err => {
                console.error('error on infinite scroll ',err);
                this.isRequestVendors = false;
            });

        this.vendors$ = Observable
            .combineLatest(
                this.vendorService.combinedVendors$,
                this.sortBy$,
                //this.searchKey$,
            )
            .map(([vendors, sortBy]) => {
                console.log(vendors);
                let filteredVendors = vendors;
                let order = 'desc';
                if (sortBy == 'A-Z') {
                    sortBy = 'name';
                    order = 'asc';
                }
                if (sortBy == 'Z-A') {
                    sortBy = 'name';
                }
                // this.getInfiniteScroll();
                let sortedVendors = _.orderBy(filteredVendors, [sortBy], [order]);
                this.vendors = sortedVendors;
                this.searchKeyLast = this.searchKey;
                return sortedVendors;
            });

    }
    
    viewVendorModal(vendor = null) {
        let data = {vendor: vendor, keyboard: []};
        
    }
    
    editVendorModal(vendor) {
        let accountVendors: any = vendor.account_vendor;
        accountVendors.vendor_id = vendor.id;
        
        //check local vendor or global, to make edit from viewVendorModal to editVendorModel work
        if (vendor.vendor_id) {
            let globalVendor: any = _.find(this.vendors, {id: vendor.vendor_id});
            accountVendors = globalVendor.account_vendor;
            accountVendors.vendor_id = globalVendor.id;
        }
        
        
        let data = {vendor: accountVendors, keyboard: []};
        
    }

    
    saveVendor(){
    }

    vendorsFilter(event) {
        this.searchKeyLast = this.searchKey;
        let value = event.target.value.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        this.searchKey$.next(value); // TODO а надо ли это если на бэке правильно фильтруется?

    }

    vendorsSort(event) {
        let value = event.target.value;
        this.sortBy = value;
        this.sortBy$.next(value);
    }

    requestVendor() {
    }
    
    getInfiniteScroll() {
        let scrollBottom = (document.body.scrollHeight - document.body.scrollTop - window.innerHeight < 285) && !(<any>this.body).classList.contains("noscroll");
        this.infiniteScroll$.next(scrollBottom);
    }
    
    @HostListener('window:scroll', ['$event'])
    onScroll(event) {
        this.getInfiniteScroll();
    }
    
    resetFilters() {
        this.searchKey = '';
        this.sortBy= 'A-Z';
        this.vendorService.getNextVendors(0, '', '')
        .subscribe(
          (r) => {
              this.vendorService.current_page = 1;
          })
    }
}
