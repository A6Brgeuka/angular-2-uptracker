import { Component, OnDestroy, OnInit } from '@angular/core';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import * as moment from 'moment';
import { any } from 'ramda'
import { ReconcileService } from '../../../core/services/reconcile.service';

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
  public invoices: Array<any> = [];
  public invoices_: Array<any> = [];
  public selectedInvoice: any = {};
  public DOLLARSIGNS: any = {
    USD: '$',
    CAD: '$',
    MXN: '$',
    JPY: '¥',
  }
  public board: any = {}
  public selectConfig = { displayKey: "order_number", search: true };

  constructor(
    public reconcileService: ReconcileService
  ) {
    this.board = {
      pkg: 'Box',
      qty: 20,
      pkgPrice: 20,
      discountAmount: 20,
      discountType: 'PERCENT',
    }
  }
  
  ngOnInit() {
    this.reconcileService.getInvoices().subscribe(res => {
      console.log('----->>>   ', res)
      res.map(invoice => {
        invoice.order_items.forEach(item => {
          item.qty_ = item.qty;
          item.package_price_ = item.package_price;
        })
      })
      this.invoices = res;
      // this.invoices_ = res;
      if (this.invoices.length > 0) {
        this.selectedInvoice = this.invoices[0];
        this.selectedInvoice.currency = 'USD';
      }
    });
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
    this.panelVisible = any((pd) => pd.checked)(this.selectedInvoice.order_items);
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
