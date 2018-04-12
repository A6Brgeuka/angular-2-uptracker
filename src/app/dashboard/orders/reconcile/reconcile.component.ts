import { Component, OnDestroy, OnInit } from '@angular/core';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import * as moment from 'moment';
import { any } from 'ramda'

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
  public panelVisible: boolean = false
  public products: Array<any> = [];
  
  constructor() {
    this.products = [
      {
        name: 'Gloves Tender Touch Nitrile Sempecare',
        pkgTop: 'Box', pkgBottom: 'Box',
        qtyTop: 100, qtyBottom: 50,
        pkgpTop: '$10.00', pkgpBottom: '$10.00',
        dtTop: '0.00', dtBottom: '$5.00',
        discTop: '$20.00', discBottom: '$15.00',
        totalTop: '$500.00', totalBottom: '$450.00',
        checked: false,
      },
      {
        name: 'Gloves Tender Touch Nitrile Sempecare',
        pkgTop: 'Box', pkgBottom: 'Box',
        qtyTop: 100, qtyBottom: 50,
        pkgpTop: '$10.00', pkgpBottom: '$10.00',
        dtTop: '0.00', dtBottom: '$5.00',
        discTop: '$20.00', discBottom: '$15.00',
        totalTop: '$500.00', totalBottom: '$450.00',
        checked: false,
      },
      {
        name: 'Gloves Tender Touch Nitrile Sempecare',
        pkgTop: 'Box', pkgBottom: 'Box',
        qtyTop: 100, qtyBottom: 50,
        pkgpTop: '$10.00', pkgpBottom: '$10.00',
        dtTop: '0.00', dtBottom: '$5.00',
        discTop: '$20.00', discBottom: '$15.00',
        totalTop: '$500.00', totalBottom: '$450.00',
        checked: false,
      }
    ]
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

  productSelect(product) {
    product.checked = !product.checked
    this.panelVisible = any((pd) => pd.checked)(this.products);
  }

  bulkUpdates() {
    this.panelVisible = false;
  }

  bulkNevermind() {
    this.panelVisible = false;
  }
}
