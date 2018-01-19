import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { PastOrderService } from '../../core/services/pastOrder.service';

import { Router } from '@angular/router';
import { ModalWindowService } from '../../core/services/modal-window.service';
import { ToasterService } from '../../core/services/toaster.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
@DestroySubscribers()
export class OrdersComponent implements OnInit, OnDestroy, AfterViewInit {
  public subscribers: any = {};
  public searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public orders$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public selectAll: boolean;
  public searchKey: string;
  public sortBy: string;
  public sortBy$: BehaviorSubject<any> = new BehaviorSubject(null);
  public visible:boolean[] = [];
  
  @ViewChild('allTab') allTab: ElementRef;
  
  constructor(
      public modal: Modal,
      public router: Router,
      public pastOrderService: PastOrderService,
      public modalWindowService: ModalWindowService,
      public toasterService: ToasterService,
  ) {
  
  }

  ngOnInit() {
  
  }
  
  ngAfterViewInit() {
  }
  
  ngOnDestroy() {
    console.log('for unsubscribing');
  }
  
  searchFilter(event) {
    // replace forbidden characters
    const value = event.target.value.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    this.searchKey$.next(value);
  };
  
  showFiltersModal() {
  
  }
  
}
