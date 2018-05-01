import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { DatepickerComponent } from 'angular2-material-datepicker';
import { any, comparator, equals, gt, prop, sort, sortBy, toLower, isEmpty, isNil } from 'ramda';
import { SelectComponent, IOption } from 'ng-select';
import { ReconcileService } from '../../../core/services/index';
import { ReconcileProductModal } from '../reconcile-product-modal/reconcile-product-modal.component';
import { ModalWindowService } from '../../../core/services/modal-window.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { ConfirmModalService } from '../../../shared/modals/confirm-modal/confirm-modal.service';
import Currencies from './reconcile.currency'

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

  @ViewChild('datepicker') datepicker: DatepickerComponent;

  constructor(
    public modal: Modal,
    public reconcileService: ReconcileService,
    public modalWindowService: ModalWindowService,
    public router: Router,
    public toasterService: ToasterService,
    public confirmModalService: ConfirmModalService,
  ) {
  }

  ngOnInit() {
    try {
      this.currencies = Currencies;
      this.board = {
        qty: null,
        pkgPrice: null,
        discountAmount: null,
        discountType: 'PERCENT',
      };
      this.reconcileService.orders$.subscribe(res => {
        this.orders = res;
      });
      this.reconcileService.invoice$.subscribe(res => {
        // res.invoice.invoice_date = new Date(res.invoice.invoice_date);
        res.invoice.invoice_date = new Date();
        res.invoice.discount_ = 0;
        res.invoice.discount_type = 'PERCENT';

        res.invoice.shipping = res.invoice.shipping || 0;
        res.invoice.handling = res.invoice.handling || 0;
        res.invoice.tax = res.invoice.tax || 0;
        res.invoice.total = res.invoice.total || 0;
        res.invoice.invoice_credit = res.invoice.invoice_credit || 0;
        res.invoice.sub_total = res.invoice.sub_total || 0;

        this.selectedInvoice = res;
        this.updateInvoiceDetails({});
      })
      this.reconcileService.invoices$.subscribe(res => {
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
    console.log('for unsubscribing');
  }

  addSubscribers() {}

  handleInvoiceChanges(event) {
    try {
      this.reconcileService.getReconcile(event.value, this.orders.id).subscribe(res => {
        if (isNil(res.data)) {
          this.toasterService.pop('error', 'Invoice or Order items are in usage now.');
        } else {
          res.data.invoice.invoice_date = new Date(res.invoice.invoice_date)
          res.data.invoice.discount_ = res.invoice.discount;
          res.data.invoice.discount_type = 'USD';
  
          res.data.items.forEach(item => {
            item.reconciled_discount_type = 'PERCENT';
            this.productChange(item);
          });
  
          this.selectedInvoice = res.data;
          this.updateInvoiceDetails({});
        }
      })
    } catch (err) {
      console.log('handleInvoiceChanges: ', err);
    }
  }

  updateInvoiceDetails(event) {
    try {
      // Total
      this.selectedInvoice.invoice.total = this.selectedInvoice.invoice.calculated_sub_total
      + this.selectedInvoice.invoice.shipping
      + this.selectedInvoice.invoice.handling
      + this.selectedInvoice.invoice.tax;

      // Calculated Total
      let calculated_total = this.selectedInvoice.invoice.sub_total
      + this.selectedInvoice.invoice.shipping
      + this.selectedInvoice.invoice.handling
      + this.selectedInvoice.invoice.tax
      - this.selectedInvoice.invoice.invoice_credit;

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

  handleCurrencyChange(event) {
    this.selectedInvoice.invoice.currency = event.value;
  }

  goBack() {
    this.router.navigate(['/orders/items']);
  }

  showProductModal() {
    this.modal
    .open(ReconcileProductModal, this.modalWindowService.overlayConfigFactoryWithParams({}));
  }

  packageChange(product) {
    console.log('----------->>>   ', product);
    if (product.package_price > product.reconciled_package_price) {
      this.confirmModalService.confirmModal('Warning', 'Is this a price change or discount?', [
        {text: 'Price Change', value: 'price', cancel: true},
        {text: 'Discount', value: 'discount', cancel: false}
      ])
      .subscribe((res) => {
        if (res.success) {
          product.reconciled_discounted_price = product.reconciled_package_price;
          product.reconciled_discount = (product.package_price - product.reconciled_discounted_price).toFixed(2);
          product.reconciled_package_price = product.package_price;
          product.reconciled_discount_type = 'USD';
        }
      });
    } else if (product.package_price < product.reconciled_package_price) {
      this.confirmModalService.confirmModal('Warning', 'Is this a new price?', [
        {text: 'Yes', value: 'yes', cancel: false},
        {text: 'No', value: 'no', cancel: true}
      ])
      .subscribe((res) => {
        if (res.success) {

        }
      });
    }
  }

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

  productChange(product) {
    try {
      if (product.reconciled_discount_type === 'PERCENT') {
        product.reconciled_discounted_price = ((1 - product.reconciled_discount / 100) * product.reconciled_package_price) || 0;
      } else {
        product.reconciled_discounted_price = (product.reconciled_package_price - product.reconciled_discount) || 0;
      }
      product.reconciled_total = (product.reconciled_discounted_price * product.reconciled_qty) || 0;
      this.selectedInvoice.invoice.calculated_sub_total = product.reconciled_total;
      this.updateInvoiceDetails({});
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

  getUpdates(reconciled) {
    let items = [];
    this.selectedInvoice.items.forEach(item => {
      const newItem = {
        order_id: item.order_id,
        order_line_item_id: item.order_line_item_id,
        invoice_line_item_id: item.invoice_line_item_id,
        item_name: item.item_name,
        order_qty: item.order_qty,
        received_qty: item.received_qty,
        package_price: item.package_price,
        discount: item.discount,
        discounted_price: item.discounted_price,
        total: item.total,
        reconciled_qty: item.reconciled_qty,
        reconciled_package_price: item.reconciled_package_price,
        reconciled_discount: item.reconciled_discount,
        reconciled_discounted_price: item.reconciled_discounted_price,
        reconciled_total: item.reconciled_total,
      };

      items.push(newItem);
    })

    const invoice = {
      currency: this.selectedInvoice.invoice.currency,
      discount: this.selectedInvoice.invoice.discount,
      handling: this.selectedInvoice.invoice.handling,
      invoice_date: this.selectedInvoice.invoice.invoice_date,
      invoice_number: this.selectedInvoice.invoice.invoice_number,
      invoice_id: this.selectedInvoice.invoice.invoice_id,
      reconciled,
      shipping: this.selectedInvoice.invoice.shipping,
      sub_total: this.selectedInvoice.invoice.sub_total,
      tax: this.selectedInvoice.invoice.tax,
      total: this.selectedInvoice.invoice.total,
      vendor_id: this.selectedInvoice.invoice.vendor_id,
      vendor_name: this.selectedInvoice.invoice.vendor_name,
      attachments: [],
    }

    const payload = { items, invoice }

    return payload;
  }

  reconcileSave() {
    this.toasterService.pop("", "Invoice details updated successfully");
    const payload = this.getUpdates(false);
    this.reconcileService.updateReconcile(payload).subscribe(res => {
      this.router.navigate(['/orders/invoices']);
    });
  }

  reconcilePay() {
    this.toasterService.pop("", "Invoice details updated successfully");
    const payload = this.getUpdates(true);
    this.reconcileService.updateReconcile(payload);
  }

  reconcileCancel() {
    this.goBack()
  }

  updateProducts() {}
}
