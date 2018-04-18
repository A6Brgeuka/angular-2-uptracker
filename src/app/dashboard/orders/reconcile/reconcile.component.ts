import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { DatepickerComponent } from 'angular2-material-datepicker';
import { any, comparator, equals, gt, prop, sort, sortBy, toLower } from 'ramda';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as CurrencyFormatter from 'currency-formatter';
import * as Currency from 'currency-codes';
import { ReconcileService } from '../../../core/services/reconcile.service';
import { ReconcileProductModal } from '../reconcile-product-modal/reconcile-product-modal.component';
import { ModalWindowService } from '../../../core/services/modal-window.service';

@Component({
  selector: 'app-reconcile',
  templateUrl: './reconcile.component.html',
  styleUrls: ['./reconcile.component.scss']
})
@DestroySubscribers()
export class ReconcileComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  public sort: string = 'A-Z';
  public filter: string = '';
  public panelVisible: boolean = false
  public invoices: Array<any> = [];
  public invoices_: Array<any> = [];
  public selectedInvoice: any = {invoice: {}, items: [], vendors: {}};
  public DOLLARSIGNS: any = { USD: '$', CAD: '$', MXN: '$', JPY: '¥' }
  public board: any = {};
  public selectConfig: any = { displayKey: "id", search: true };
  public taxBoardVisible: boolean = false;
  public productHeader: boolean = false;
  public currencies: any = [];

  @ViewChild('datepicker') datepicker: DatepickerComponent;

  constructor(
    public modal: Modal,
    public reconcileService: ReconcileService,
    public modalWindowService: ModalWindowService
  ) {
  }

  ngOnInit() {
    Currency.codes().forEach(code => {
      this.currencies.push(Currency.code(code));
    })
    this.reconcileService.getReconcile().subscribe(res => {
      res.id = '5ad4f32e3d0192000d3acf1e';
      res.invoice.calculated_sub_total = parseFloat(res.invoice.calculated_sub_total.replace('$', ''));
      res.invoice.discount_ = res.invoice.discount;
      res.invoice.discount_type = 'USD';

      res.items.forEach(item => {
        item.discounted_price = parseFloat(item.discounted_price.replace('$', ''));
        item.package_price = parseFloat(item.package_price.replace('$', ''));
        item.total = parseFloat(item.total.replace('$', ''));
        item.reconciled_discount_type = 'PERCENT';
        item.reconciled_discounted_price = parseFloat(item.reconciled_discounted_price.replace('$', ''));
        item.reconciled_package_price = parseFloat(item.reconciled_package_price.replace('$', ''));
        item.reconciled_total = parseFloat(item.reconciled_total.replace('$', ''));
        this.productChange(item);
      })

      this.invoices = [res];
      this.invoices_ = _.cloneDeep(this.invoices);
      this.selectedInvoice = this.invoices[0];
      this.invoiceChange({});
      console.log('-------------<<<   ', res)
    })

    this.board = {
      qty: null,
      pkgPrice: null,
      discountAmount: null,
      discountType: 'PERCENT',
    }
  }

  ngOnDestroy() {
    console.log('for unsubscribing')
  }

  currencyFormat(event: string) {
    const value = parseFloat(event);
    return CurrencyFormatter.format(value, { code: 'USD' });
  }

  showProductModal() {
    this.modal
    .open(ReconcileProductModal, this.modalWindowService.overlayConfigFactoryWithParams({}));
  }

  addSubscribers() {}
  
  toggleSelectAll() {}

  removeProduct(product) {
    product.checked = false;
    this.panelVisible = any((pd) => pd.checked)(this.selectedInvoice.items);
  }
  
  saveReconcile() {}

  openFilterModal() {}

  filterChange(event) {}

  productHeaderSelect(event) {
    setTimeout(() => {
      this.selectedInvoice.items.forEach(item => {
        item.checked = this.productHeader;
      })
      this.panelVisible = any((pd) => pd.checked)(this.selectedInvoice.items);
    })
  }

  productSelect(product) {
    product.checked = !product.checked
    this.panelVisible = any((pd) => pd.checked)(this.selectedInvoice.items);
  }

  invoiceChange(event) {
    try {
      // Total
      let total = this.selectedInvoice.invoice.sub_total
      - this.selectedInvoice.invoice.invoice_credit
      + this.selectedInvoice.invoice.shipping
      + this.selectedInvoice.invoice.handling
      + this.selectedInvoice.invoice.tax;

      if (this.selectedInvoice.invoice.discount_type === 'PERCENT') {
        this.selectedInvoice.invoice.discount = total * this.selectedInvoice.invoice.discount_ / 100;
      } else {
        this.selectedInvoice.invoice.discount = this.selectedInvoice.invoice.discount_;
      }
      this.selectedInvoice.invoice.total = total - this.selectedInvoice.invoice.discount;

      // Calculated Total
      let calculated_total = this.selectedInvoice.invoice.calculated_sub_total
      - this.selectedInvoice.invoice.invoice_credit
      + this.selectedInvoice.invoice.shipping
      + this.selectedInvoice.invoice.handling
      + this.selectedInvoice.invoice.tax;

      if (this.selectedInvoice.invoice.discount_type === 'PERCENT') {
        this.selectedInvoice.invoice.discount = calculated_total * this.selectedInvoice.invoice.discount_ / 100;
      } else {
        this.selectedInvoice.invoice.discount = this.selectedInvoice.invoice.discount_;
      }
      this.selectedInvoice.invoice.calculated_total = calculated_total - this.selectedInvoice.invoice.discount;

      // Diff
      this.selectedInvoice.invoice.diff = this.selectedInvoice.invoice.calculated_total - this.selectedInvoice.invoice.total;
    } catch (err) {
      console.log(err);
    }
  }

  productChange(product) {
    try {
      if (product.reconciled_discount_type === 'PERCENT') {
        product.reconciled_discounted_price = (1 - product.reconciled_discount / 100) * product.reconciled_package_price;
      } else {
        product.reconciled_discounted_price = product.reconciled_package_price - product.reconciled_discount;
      }
      product.reconciled_total = (product.reconciled_discounted_price * product.received_qty);
    } catch (err) {
      console.log(err);
    }
  }

  bulkUpdates() {
    this.panelVisible = false;
    this.productHeader = false;
    this.selectedInvoice.items.forEach(item => {
      if (item.checked) {
        item.received_qty_ = this.board.qty ? parseInt(this.board.qty).toLocaleString() : item.received_qty_;
        item.package_price_ = this.board.pkgPrice ? this.board.pkgPrice.toLocaleString() : item.package_price_;
        item.discounted_price_ = this.board.discountAmount ? this.board.discountAmount.toLocaleString() : item.discounted_price_;
      }
      this.productChange(item);
      item.checked = false;
    })
  }

  bulkNevermind() {
    this.panelVisible = false;
    this.productHeader = false;
    this.selectedInvoice.items.map(item => item.checked = false)
  }

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

  toggleDatepicker(event) {
    event.stopPropagation();
    this.datepicker.showCalendar = !this.datepicker.showCalendar;
  }

  updateDetails() {
    let items = [];
    this.selectedInvoice.items.forEach(item => {
      const newItem = {
        invoice_line_item_id: item.invoice_line_item_id,
        discount: item.discount,
        discounted_price: item.discounted_price,
        order_line_item_id: item.order_line_item_id,
        order_qty: item.order_qty,
        package_price: item.package_price,
        received_qty: item.received_qty,
        reconciled_qty: item.reconciled_qty,
        reconciled_package_price: item.reconciled_package_price,
        reconciled_discount: item.reconciled_discount,
        reconciled_discounted_price: item.reconciled_discounted_price,
        reconciled_total: item.reconciled_total,
      };
      items.push(item);
    })
    const invoice = {
      currency: this.selectedInvoice.invoice.currency,
      discount: this.selectedInvoice.invoice.discount,
      handling: this.selectedInvoice.invoice.handling,
      invoice_date: this.selectedInvoice.invoice.invoice_date,
      invoice_number: this.selectedInvoice.invoice.invoice_number,
      shipping: this.selectedInvoice.invoice.shipping,
      sub_total: this.selectedInvoice.invoice.sub_total,
      tax: this.selectedInvoice.invoice.tax,
      total: this.selectedInvoice.invoice.total,
      vendor_id: this.selectedInvoice.invoice.vendor_id,
      vendor_name: this.selectedInvoice.invoice.vendor_name,
    }

    const payload = { items, invoice }
    this.reconcileService.createReconcile(payload);
  }
}
