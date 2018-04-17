import { Component, OnDestroy, OnInit } from '@angular/core';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import * as moment from 'moment';
import { any, comparator, equals, gt, prop, sort, sortBy, toLower } from 'ramda';
import * as _ from 'lodash';
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
  public selectedInvoice: any = {invoice: {}, items: [], vendors: {}};
  public DOLLARSIGNS: any = {
    USD: '$',
    CAD: '$',
    MXN: '$',
    JPY: '¥',
  }
  public board: any = {};
  public selectConfig = { displayKey: "id", search: true };
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
    this.reconcileService.getReconcile().subscribe(res => {
      res.id = '5ad4f32e3d0192000d3acf1e';
      res.invoice.invoice_date = '04/16/2018';
      res.invoice.currency = 'USD';
      res.invoice.invoiced_sub_total = '0.00';
      res.invoice.invoice_credit = '0.00';
      res.invoice.shipping = '0.00';
      res.invoice.handling = '0.00';
      res.invoice.taxes = '0.00';
      res.invoice.po_discount = '0.00';
      res.invoice.po_discount_type = 'PERCENT';
      res.invoice.total = '0.00';
      res.invoice.calculated_total = '0.00';
      res.invoice.diff = '0.00';

      res.items.forEach(item => {
        item.package_ = item.package;
        item.received_qty_ = item.received_qty;
        item.package_price_ = item.package_price.replace('$', '');
        item.discounted_price_ = item.discounted_price.replace('$', '');
        item.discounted_price_type = 'USD';
        item.total_ = item.total;
        item.disc_price = '$10.00';

        this.productChange(item);
      })

      this.invoices = [res];
      this.invoices_ = _.cloneDeep(this.invoices);
      this.selectedInvoice = this.invoices[0];
      this.invoiceChange({});
      console.log('-------------<<<   ', res)
    })
  }
  
  ngOnDestroy() {
    console.log('for unsubscribing')
  }

  addSubscribers() {}
  
  toggleSelectAll() {}
  
  addProduct() {}

  removeProduct(product) {
    product.checked = false;
    this.panelVisible = any((pd) => pd.checked)(this.selectedInvoice.items);
  }
  
  saveReconcile() {}

  openFilterModal() {}

  filterChange(event) {}

  productSelect(product) {
    product.checked = !product.checked
    this.panelVisible = any((pd) => pd.checked)(this.selectedInvoice.items);
  }

  invoiceChange(event) {
    try {
      // Total
      let total = parseFloat(this.selectedInvoice.invoice.invoiced_sub_total)
      - parseFloat(this.selectedInvoice.invoice.invoice_credit)
      + parseFloat(this.selectedInvoice.invoice.shipping)
      + parseFloat(this.selectedInvoice.invoice.handling)
      + parseFloat(this.selectedInvoice.invoice.taxes);

      let po_discount = 0;
      if (this.selectedInvoice.invoice.po_discount_type === 'PERCENT') {
        po_discount = total * parseFloat(this.selectedInvoice.invoice.po_discount) / 100;
      } else {
        po_discount = parseFloat(this.selectedInvoice.invoice.po_discount);
      }
      total = total - po_discount;
      this.selectedInvoice.invoice.total = total;

      // Calculated Total
      let calculated_total = parseFloat(this.selectedInvoice.invoice.calculated_sub_total.replace('$', ''))
      - parseFloat(this.selectedInvoice.invoice.invoice_credit)
      + parseFloat(this.selectedInvoice.invoice.shipping)
      + parseFloat(this.selectedInvoice.invoice.handling)
      + parseFloat(this.selectedInvoice.invoice.taxes);

      po_discount = 0;
      if (this.selectedInvoice.invoice.po_discount_type === 'PERCENT') {
        po_discount = calculated_total * parseFloat(this.selectedInvoice.invoice.po_discount) / 100;
      } else {
        po_discount = parseFloat(this.selectedInvoice.invoice.po_discount);
      }
      calculated_total = calculated_total - po_discount;
      this.selectedInvoice.invoice.calculated_total = calculated_total;

      // Diff
      this.selectedInvoice.invoice.diff = (calculated_total - total).toFixed(2);
    } catch (err) {
      console.log(err);
    }
  }

  productChange(product) {
    try {
      let disc_price = 0;
      if (product.discounted_price_type === 'PERCENT') {
        disc_price = (1 -  parseFloat(product.discounted_price_) / 100) * parseFloat(product.package_price_);
      } else {
        disc_price = parseFloat(product.package_price_) - parseFloat(product.discounted_price_);
      }
      product.disc_price_ = disc_price.toFixed(2);
      product.total_ = (product.disc_price_ * product.received_qty_).toFixed(2);
    } catch (err) {
      console.log('err');
    }
  }

  bulkUpdates() {
    this.panelVisible = false;
    this.selectedInvoice.items.forEach(item => {
      item.checked = false;
    })
  }

  bulkNevermind() {
    this.panelVisible = false;
  }

  changeInvoice() {}

  getMask(product) {
    return `{ prefix: '${this.DOLLARSIGNS[product.currency]}', thousands: ',', decimal: '.', align: 'left' }`
  }

  toggleTaxBoard() {
    this.taxBoardVisible = !this.taxBoardVisible;
  }

  taxBoardOKClick() {
    this.taxBoardVisible = !this.taxBoardVisible;

    const total = parseFloat(this.selectedInvoice.invoice.taxes)
      + parseFloat(this.selectedInvoice.invoice.sales_tax)
      + parseFloat(this.selectedInvoice.invoice.vat);
    this.selectedInvoice.invoice.taxes = total.toString();
  }

  sortAlphabet(event) {
    if (equals(this.sort, 'A-Z')) {
      const ascComparator = comparator((a, b) => gt(prop('item_name', b), prop('item_name', a)));
      this.selectedInvoice.items = sort(ascComparator, this.selectedInvoice.items);
    } else {
      const desComparator = comparator((a, b) => gt(prop('item_name', a), prop('item_name', b)));
      this.selectedInvoice.items = sort(desComparator, this.selectedInvoice.items);
    }
  }

  filtered(product) {
    if (!this.filter) {
      return true;
    }
    return toLower(product.item_name).indexOf(toLower(this.filter)) > -1;
  }
}
