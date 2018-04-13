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
  public invoices: Array<any> = [];
  public invoiceId: string = '';
  public selectedInvoice: any = {};
  public DOLLARSIGNS: any = {
    USD: '$',
    CAD: '$',
    MXN: '$',
    JPY: '¥',
  }

  constructor() {
    this.products = [
      {
        name: 'Gloves Tender Touch Nitrile Sempecare 1',
        pkgTop: 'Box', pkgBottom: 'Box',
        qtyTop: 100, qtyBottom: 50,
        pkgpTop: 10.00, pkgpBottom: 10.00,
        dtTop: 0.00, dtBottom: 5.00,
        discTop: 20.00, discBottom: 15.00,
        totalTop: 500.00, totalBottom: 450.00,
        checked: false,
      },
      {
        name: 'Gloves Tender Touch Nitrile Sempecare 2',
        pkgTop: 'Box', pkgBottom: 'Box',
        qtyTop: 100, qtyBottom: 50,
        pkgpTop: 10.00, pkgpBottom: 10.00,
        dtTop: 0.00, dtBottom: 5.00,
        discTop: 20.00, discBottom: 15.00,
        totalTop: 500.00, totalBottom: 450.00,
        checked: false,
      },
      {
        name: 'Gloves Tender Touch Nitrile Sempecare 3',
        pkgTop: 'Box', pkgBottom: 'Box',
        qtyTop: 100, qtyBottom: 50,
        pkgpTop: 10.00, pkgpBottom: 10.00,
        dtTop: 0.00, dtBottom: 5.00,
        discTop: 20.00, discBottom: 15.00,
        totalTop: 500.00, totalBottom: 450.00,
        checked: false,
      }
    ]
    this.invoices = [
      {
        id: '#KOM-123456787',
        date: 'Feb 1, 2018',
        currency: 'USD',
        calculatedSubTotal: 250,
        invoicedSubTotal: 220,
        invoiceCredit: 5,
        shipping: 20,
        handling: 5,
        taxes: 0,
        total: 200,
        discountAmount: 20,
        discountType: 'PERCENT',
      },
      {
        id: '#KOM-123456788',
        date: 'Feb 2, 2018',
        currency: 'CAD',
        calculatedSubTotal: 250,
        invoicedSubTotal: 215,
        invoiceCredit: 5,
        shipping: 20,
        handling: 5,
        taxes: 0,
        total: 200,
        discountAmount: 20,
        discountType: 'PERCENT',
      },{
        id: '#KOM-123456789',
        date: 'Feb 3, 2018',
        currency: 'JPY',
        calculatedSubTotal: 250,
        invoicedSubTotal: 225,
        invoiceCredit: 5,
        shipping: 20,
        handling: 5,
        taxes: 0,
        total: 200,
        discountAmount: 20,
        discountType: 'PERCENT',
      }
    ]
    this.selectedInvoice = this.invoices[0];
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

  removeProduct(product) {
    product.checked = false;
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

  changeInvoice() {}

  getCalculatedTotal() {
    const total = this.selectedInvoice.invoicedSubTotal
      - this.selectedInvoice.invoiceCredit
      + this.selectedInvoice.shipping
      + this.selectedInvoice.handling
      + this.selectedInvoice.taxes
      - this.selectedInvoice.discountAmount;
    return total;

  }

  getDiff() {
    return this.getCalculatedTotal() - this.selectedInvoice.total;
  }

  getDollarSign() {
    const type = this.selectedInvoice.currency;
    switch (type) {
      case 'USD':
        return '$';
      case 'CAD':
        return '$';
      case 'MXN':
        return '$';
      case 'JPY':
        return '¥';
      default:
        return '$';
    }
  }

  getMask(product) {
    return `{ prefix: '${this.DOLLARSIGNS[product.currency]}', thousands: ',', decimal: '.', align: 'left' }`
  }

  dollarSignChange(event) {
    this.selectedInvoice.currency = event;
    this.selectedInvoice.discountType = event;
  }
}
