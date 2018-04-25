import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { DatepickerComponent } from 'angular2-material-datepicker';
import { any, comparator, equals, gt, prop, sort, sortBy, toLower, isEmpty, isNil } from 'ramda';
import { SelectComponent, IOption } from 'ng-select';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as CurrencyFormatter from 'currency-formatter';
import * as Currency from 'currency-codes';
import { ReconcileService, UserService } from '../../../core/services/index';
import { ReconcileProductModal } from '../reconcile-product-modal/reconcile-product-modal.component';
import { ModalWindowService } from '../../../core/services/modal-window.service';
import { ToasterService } from '../../../core/services/toaster.service';

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
  public invoices: Array<IOption> = [];
  public selectedInvoice: any = {invoice: {currency: 'usd', invoice_number: 'Select Invoice'}, items: [], vendors: {}};
  public DOLLARSIGNS: any = { USD: '$', CAD: '$', MXN: '$', JPY: '¥' }
  public board: any = {};
  public taxBoardVisible: boolean = false;
  public productHeader: boolean = false;
  public currency: any = {}
  public currencies: Array<IOption> = [];
  public orders: any = {};
  public currencyBlackList: Array<string> = [];
  private invoiceSubscription: Subscription;
  private invoicesSubscription: Subscription;
  private orderSubscription: Subscription;

  @ViewChild('datepicker') datepicker: DatepickerComponent;

  constructor(
    public modal: Modal,
    public reconcileService: ReconcileService,
    public modalWindowService: ModalWindowService,
    public userService: UserService,
    public router: Router,
    public toasterService: ToasterService,
  ) {
  }

  ngOnInit() {
    try {
      this.currencyBlackList = ['ALL', 'AMD', 'AOA', 'BOV', 'BYR', 'CHE', 'CHW', 'CLF', 'COU', 'CUC', 'LVL', 'LSL',
      'MXV', 'PAB', 'SCR', 'SDG', 'SSP', 'TMT', 'USN', 'USS', 'UYI', 'XAF', 'XAG', 'XAU', 'XBA', 'XBB', 'XBC',
      'XBD', 'XBT', 'XDR', 'XFU', 'XPD', 'XPT', 'XTS', 'XXX', 'USD', 'GBP', 'EUR', 'CAD', 'AUD'];
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
      });
      this.invoiceSubscription = this.reconcileService.invoice$.subscribe(res => {
        // res.invoice.invoice_date = new Date(res.invoice.invoice_date);
        res.invoice.invoice_date = new Date();
        res.invoice.discount_ = 0;
        res.invoice.discount_type = 'PERCENT';
        this.selectedInvoice = res;
      })
      this.invoicesSubscription = this.reconcileService.invoices$.subscribe(res => {
        res.forEach(item => {
          this.invoices.push({
            value: item.invoice_id, label: item.invoice_number
          });
        })
      })
    } catch (err) {
      console.log('ngOnInit: ', err);
      this.router.navigate(['/orders/items']);
    }
  }

  ngOnDestroy() {
    try {
      console.log('for unsubscribing');
      this.orderSubscription.unsubscribe();
      this.invoiceSubscription.unsubscribe();
      this.invoicesSubscription.unsubscribe();
    } catch (err) {
      console.log('ngOnDestroy: ', err);
      this.router.navigate(['/orders/items']);
    }
  }

  handleInvoiceChanges(event) {
    try {
      this.reconcileService.getReconcile(event.value, this.orders.id).subscribe(res => {
        // console.log('---------->>>   ', res)
        res.invoice.invoice_date = new Date(res.invoice.invoice_date)
        res.invoice.discount_ = res.invoice.discount;
        res.invoice.discount_type = 'USD';

        res.items.forEach(item => {
          item.reconciled_discount_type = 'PERCENT';
          this.productChange(item);
        });

        this.selectedInvoice = res;
        this.updateInvoiceDetails({});
      })
    } catch (err) {
      console.log('handleInvoiceChanges: ', err);
    }
  }

  handleCurrencyChange(event) {
    this.selectedInvoice.invoice.currency = event.value;
  }

  goBack() {
    this.router.navigate(['/orders/items']);
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

  deleteProduct(index) {
    this.selectedInvoice.items.splice(index, 1);
    if (this.selectedInvoice.items.length == 0) {
      this.goBack();
    }
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
      console.log('updateInvoiceDetails: ', err);
    }
  }

  productChange(product) {
    try {
      if (product.reconciled_discount_type === 'PERCENT') {
        product.reconciled_discounted_price = ((1 - product.reconciled_discount / 100) * product.reconciled_package_price) || 0;
      } else {
        product.reconciled_discounted_price = (product.reconciled_package_price - product.reconciled_discount) || 0;
      }
      product.reconciled_total = (product.reconciled_discounted_price * product.received_qty) || 0;
    } catch (err) {
      console.log('productChange: ', err);
    }
  }

  bulkUpdates() {
    this.panelVisible = false;
    this.productHeader = false;
    this.selectedInvoice.items.forEach(item => {
      if (item.checked) {
        item.reconciled_qty = this.board.qty ? this.board.qty : item.reconciled_qty;
        item.reconciled_package_price = this.board.pkgPrice ? this.board.pkgPrice : item.reconciled_package_price;
        item.reconciled_discount = this.board.discountAmount ? this.board.discountAmount : item.reconciled_discount;
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

    const total = this.selectedInvoice.invoice.tax
      + (this.selectedInvoice.invoice.sub_total * this.selectedInvoice.invoice.sales_tax / 100) || 0
      + (this.selectedInvoice.invoice.sub_total * this.selectedInvoice.invoice.vat / 100) || 0;
    this.selectedInvoice.invoice.tax = total;

    this.updateInvoiceDetails({});
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

  reconcileSave() {
    this.router.navigate(['/orders/invoices']);
  }

  reconcilePay() {
    this.toasterService.pop("", "Invoice details updated successfully");
    // let items = [];
    // this.selectedInvoice.items.forEach(item => {
    //   const newItem = {
    //     order_id: item.order_id,
    //     order_line_item_id: item.order_line_item_id,
    //     invoice_line_item_id: item.invoice_line_item_id,
    //     item_name: item.item_name,
    //     order_qty: item.order_qty,
    //     received_qty: item.received_qty,
    //     package_price: item.package_price,
    //     discount: item.discount,
    //     discounted_price: item.discounted_price,
    //     total: item.total,
    //     reconciled_qty: item.reconciled_qty,
    //     reconciled_package_price: item.reconciled_package_price,
    //     reconciled_discount: item.reconciled_discount,
    //     reconciled_discounted_price: item.reconciled_discounted_price,
    //     reconciled_total: item.reconciled_total,
    //   };

    //   items.push(newItem);
    // })

    // const invoice = {
    //   currency: this.selectedInvoice.invoice.currency,
    //   discount: this.selectedInvoice.invoice.discount,
    //   handling: this.selectedInvoice.invoice.handling,
    //   invoice_date: this.selectedInvoice.invoice.invoice_date,
    //   invoice_number: this.selectedInvoice.invoice.invoice_number,
    //   invoice_id: this.selectedInvoice.invoice.invoice_id,
    //   shipping: this.selectedInvoice.invoice.shipping,
    //   sub_total: this.selectedInvoice.invoice.sub_total,
    //   tax: this.selectedInvoice.invoice.tax,
    //   total: this.selectedInvoice.invoice.total,
    //   vendor_id: this.selectedInvoice.invoice.vendor_id,
    //   vendor_name: this.selectedInvoice.invoice.vendor_name,
    //   attachments: [],
    // }

    // const payload = { items, invoice }
    // this.reconcileService.updateReconcile(payload);
  }

  reconcileCancel() {
    this.goBack()
  }

  updateProducts() {}
}
