import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { DatepickerComponent } from 'angular2-material-datepicker';
import { any, comparator, equals, gt, prop, sort, sortBy, toLower, isEmpty, isNil } from 'ramda';
import { SelectComponent, IOption } from 'ng-select';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as CurrencyFormatter from 'currency-formatter';
import * as Currency from 'currency-codes';
import { ReconcileService, UserService } from '../../../core/services/index';
import { ReconcileProductModal } from '../reconcile-product-modal/reconcile-product-modal.component';
import { ModalWindowService } from '../../../core/services/modal-window.service';
import { Subscription } from 'rxjs';

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
  public selectedInvoice: any = {invoice: {currency: 'usd'}, items: [], vendors: {}};
  public DOLLARSIGNS: any = { USD: '$', CAD: '$', MXN: '$', JPY: '¥' }
  public board: any = {};
  public selectConfig: any = { displayKey: "invoice_number", search: true };
  public taxBoardVisible: boolean = false;
  public productHeader: boolean = false;
  public currency: any = {}
  public currencies: Array<IOption> = [];
  public orders: any = {};
  public currencyBlackList: Array<string> = [];

  private orderSubscription: Subscription;

  @ViewChild('datepicker') datepicker: DatepickerComponent;

  constructor(
    public modal: Modal,
    public reconcileService: ReconcileService,
    public modalWindowService: ModalWindowService,
    public userService: UserService
  ) {
  }

  ngOnInit() {
    // console.log('###############:   ', this.userService.selfData.account)
    this.currencyBlackList = ['ALL', 'AMD', 'AOA', 'BOV', 'BYR', 'CHE', 'CHW', 'CLF', 'COU', 'CUC', 'LVL', 'LSL', 'MXV', 'PAB', 'SCR', 'SDG', 'SSP',
      'TMT', 'USN', 'USS', 'UYI', 'XAF', 'XAG', 'XAU', 'XBA', 'XBB', 'XBC', 'XBD', 'XBT', 'XDR', 'XFU', 'XPD', 'XPT', 'XTS', 'XXX', 'USD', 'GBP', 'EUR', 'CAD', 'AUD'];
    this.currencies = [
      {value: 'usd', label: 'United States dollar'},
      {value: 'gbp', label: 'British pound'},
      {value: 'eur', label: 'Euro'},
      {value: 'cad', label: 'Canadian dollar'},
      {value: 'aud', label: 'Australian dollar'}
    ];
    Currency.codes().forEach(code => {
      if (!(any((cc) => cc == code)(this.currencyBlackList))) {
        this.currencies.push({ label: Currency.code(code).currency, value: toLower(code) });
      }
    })
    this.board = {
      qty: null,
      pkgPrice: null,
      discountAmount: null,
      discountType: 'PERCENT',
    };
    this.orderSubscription = this.reconcileService.orders$.subscribe(res => {
      this.orders = res;
      this.searchInvoices();
    });
    this.handleInvoiceChanges();
  }

  ngOnDestroy() {
    console.log('for unsubscribing');
    this.orderSubscription.unsubscribe();
  }

  searchInvoices() {
    this.reconcileService.lookInvoices(null).subscribe(res => {
      this.invoices = res;
      this.invoices_ = [_.cloneDeep(this.invoices[0])];
      this.handleInvoiceChanges();
      // console.log('INVOICES---------->>>   ', res);
      // console.log('ORDERS------------>>>   ', this.orders);
    });
  }

  handleInvoiceChanges() {
    if (this.invoices_.length == 0) return;
    this.reconcileService.getReconcile(this.invoices_[0].invoice_id).subscribe(res => {
      console.log('------------>>>   ', res);
      res.id = this.invoices_[0].invoice_id;
      res.invoice.discount_ = res.invoice.discount;
      res.invoice.discount_type = 'USD';
      res.invoice.invoice_date = '';

      res.items.forEach(item => {
        item.reconciled_discount_type = 'PERCENT';
        // item.reconciled_total = parseFloat(item.reconciled_total.replace('$', ''));
        this.productChange(item);
      })

      this.selectedInvoice = res;
      this.updateInvoiceDetails({});
      // console.log('-------------<<<   ', res)
    })
  }

  handleCurrencyChange(event) {
    this.selectedInvoice.invoice.currency = event.value;
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

  updateInvoiceDetails(event) {
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
    // this.selectedInvoice.items.forEach(item => {
    //   const newItem = {
    //     invoice_line_item_id: item.invoice_line_item_id || '',
    //     discount: item.discount || 0,
    //     discounted_price: item.discounted_price || 3.49,
    //     order_line_item_id: item.order_line_item_id || '5ad4f32e3d0192000d3acf1e',
    //     order_qty: item.order_qty || 1,
    //     package_price: item.package_price || 3.49,
    //     received_qty: item.received_qty || 1,
    //     reconciled_qty: item.reconciled_qty || 1,
    //     reconciled_package_price: item.reconciled_package_price || 3.49,
    //     reconciled_discount: item.reconciled_discount || 0,
    //     reconciled_discounted_price: item.reconciled_discounted_price || 3.49,
    //     reconciled_total: item.reconciled_total || 3.49,
    //   };
    //   items.push(newItem);
    // })
    const newItem = {
      invoice_line_item_id: '',
      discount: 0,
      discounted_price: 3.49,
      order_line_item_id: '5ad4f32e3d0192000d3acf1e',
      order_qty: 1,
      package_price: 3.49,
      received_qty: 1,
      reconciled_qty: 1,
      reconciled_package_price: 3.49,
      reconciled_discount: 0.00,
      reconciled_discounted_price: 3.49,
      reconciled_total: 3.49,
    };
    // items.push(newItem);

    const invoice = {
      currency: this.selectedInvoice.invoice.currency || 'USD',
      discount: this.selectedInvoice.invoice.discount || 0,
      handling: this.selectedInvoice.invoice.handling || 0,
      invoice_date: this.selectedInvoice.invoice.invoice_date || '4/20/2018',
      invoice_number: this.selectedInvoice.invoice.invoice_number || '100-101',
      invoice_id: this.invoices[0].invoice_id || null,
      shipping: this.selectedInvoice.invoice.shipping || 0,
      sub_total: this.selectedInvoice.invoice.sub_total || 3.49,
      tax: this.selectedInvoice.invoice.tax || 0.00,
      total: this.selectedInvoice.invoice.total || 3.49,
      vendor_id: this.selectedInvoice.invoice.vendor_id || '582f4fe306e55c3aab564065',
      vendor_name: this.selectedInvoice.invoice.vendor_name || 'Reliance Orthodontics',
      files: [],
    }

    const payload = { items, invoice }
    this.reconcileService.createReconcile(payload);
  }
}
