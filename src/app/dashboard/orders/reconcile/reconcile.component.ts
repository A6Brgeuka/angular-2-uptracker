import { Component, OnDestroy, OnInit } from '@angular/core';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import * as moment from 'moment';

@Component({
  selector: 'app-reconcile',
  templateUrl: './reconcile.component.html',
  styleUrls: ['./reconcile.component.scss']
})
@DestroySubscribers()
export class ReconcileComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  public selectAll: boolean;
  public dateOptions: any = {
    locale: { format: 'MMM D, YYYY' },
    alwaysShowCalendars: false,
    ranges: {
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    }
  }
  public sort: string = 'A-Z';
  public filter: string = '';
  
  constructor() {
  
  }
  
  ngOnInit() {
  
  }
  
  ngOnDestroy() {
    console.log('for unsubscribing')
  }
  
  addSubscribers() {
    
  }
  
  toggleSelectAll() {
  
  }
  
  addProduct() {
  
  }
  
  saveReconcile() {
  
  }

  openFilterModal() {

  }

  filterChange() {
    
  }
}
