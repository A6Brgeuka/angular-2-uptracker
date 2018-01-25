import { Component, OnInit } from '@angular/core';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { VendorService } from '../../core/services/index';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})

@DestroySubscribers()
export class VendorsComponent implements OnInit {
  public searchKey: string;
  
  constructor(
    public vendorService: VendorService,
  ) {
  }
  
  ngOnInit() {
  
  }
  
  vendorsFilter(event) {
    this.vendorService.updateSearchKey(event.target.value);
  }
  
  requestVendor() {
  }
  
  resetFilters() {
    this.searchKey = '';
    this.vendorService.updateSearchKey('');
  }
  
  selectTab(currentTab) {
    this.vendorService.updateSortBy('A-Z');
    this.vendorService.updateVendorsData(currentTab);
  }
}
