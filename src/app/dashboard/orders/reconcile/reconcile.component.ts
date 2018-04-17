import { Component, OnDestroy, OnInit } from '@angular/core';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import * as moment from 'moment';
import { any, comparator, equals, gt, prop, sort, sortBy, toLower } from 'ramda';
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
  public board: any = {};
  public selectConfig = { displayKey: "order_number", search: true };
  public taxBoardVisible = false;

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
    this.reconcileService.getReconcile().subscribe(res => {})
    this.reconcileService.getInvoices().subscribe(res => {
      res.map(invoice => {
        invoice.currency = 'USD';
        invoice.calculated_sub_total = '$250';
        invoice.invoiced_sub_total = '200';
        invoice.invoice_credit = '5.00';
        invoice.shipping = '20';
        invoice.handling = '5';
        invoice.taxes = '0.00';
        invoice.po_discount = '20.00';
        invoice.po_discount_type = 'PERCENT';
        invoice.calculated_total = '$2000.00';

        invoice.sales_tax = '0.00';
        invoice.vat = '0.00';

        invoice.order_items.forEach(item => {
          item.package = 'Box';
          item.package_ = item.package;
          item.qty_ = item.qty;
          item.package_price_ = item.package_price.replace('$', '');
          item.discount = '0.00';
          item.discount_ = '5.00';
          item.disc_price = '$20.00';
          item.disc_price_ = '$15.00';
          item.total_ = item.total;
        })
      })
      this.invoices = res;
      this.invoices_ = res;
      if (this.invoices.length > 0) {
        this.selectedInvoice = this.invoices[0];
      }
    });

  }
  
  ngOnDestroy() {
    console.log('for unsubscribing')
  }

  addSubscribers() {}
  
  toggleSelectAll() {}
  
  addProduct() {}

  removeProduct(product) {
    product.checked = false;
    this.panelVisible = any((pd) => pd.checked)(this.selectedInvoice.order_items);
  }
  
  saveReconcile() {}

  openFilterModal() {}

  filterChange(event) {}

  productSelect(product) {
    product.checked = !product.checked
    this.panelVisible = any((pd) => pd.checked)(this.selectedInvoice.order_items);
  }

  bulkUpdates() {
    this.panelVisible = false;
    this.selectedInvoice.order_items.forEach(item => {
      item.checked = false;
    })
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
    // return total;
    return '$20000.00';
  }

  getDiff() {
    // return this.getCalculatedTotal() - this.selectedInvoice.total;
    return '$2484.00'
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

  toggleTaxBoard() {
    this.taxBoardVisible = !this.taxBoardVisible;
  }

  taxBoardOKClick() {
    this.taxBoardVisible = !this.taxBoardVisible;

    const total = parseFloat(this.selectedInvoice.taxes)
      + parseFloat(this.selectedInvoice.sales_tax)
      + parseFloat(this.selectedInvoice.vat);
    this.selectedInvoice.taxes = total.toString();
  }

  sortAlphabet(event) {
    if (equals(this.sort, 'A-Z')) {
      const ascComparator = comparator((a, b) => gt(prop('item_name', b), prop('item_name', a)));
      this.selectedInvoice.order_items = sort(ascComparator, this.selectedInvoice.order_items);
    } else {
      const desComparator = comparator((a, b) => gt(prop('item_name', a), prop('item_name', b)));
      this.selectedInvoice.order_items = sort(desComparator, this.selectedInvoice.order_items);
    }
  }

  filtered(product) {
    if (!this.filter) {
      return true;
    }
    return toLower(product.item_name).indexOf(toLower(this.filter)) > -1;
  }
}
