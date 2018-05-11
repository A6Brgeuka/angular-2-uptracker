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
  public symbol: string = 'USD';

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
        res.invoice.invoice_date = new Date();
        res.invoice.discount_ = 0;
        res.invoice.discount_type = 'PERCENT';
        res.items.forEach(item => {
          item.reconciled_discount_type = 'PERCENT';
        });

        this.selectedInvoice = res;
        this.updateInvoiceDetails({});
      })
      this.reconcileService.invoices$.subscribe(res => {
        const invoices = [];
        res.forEach(item => {
          invoices.push({
            value: item.invoice_id, label: item.invoice_number
          });
        });
        setTimeout(() => {
          this.invoices = invoices;
        });
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

  updateInvoiceDetails(event) {
    if (isNil(this.selectedInvoice.invoice.sub_total)) this.selectedInvoice.invoice.sub_total = 0;
    if (isNil(this.selectedInvoice.invoice.invoice_credit)) this.selectedInvoice.invoice.invoice_credit = 0;
    if (isNil(this.selectedInvoice.invoice.shipping)) this.selectedInvoice.invoice.shipping = 0;
    if (isNil(this.selectedInvoice.invoice.handling)) this.selectedInvoice.invoice.handling = 0;
    if (isNil(this.selectedInvoice.invoice.tax)) this.selectedInvoice.invoice.tax = 0;
    if (isNil(this.selectedInvoice.invoice.discount)) this.selectedInvoice.invoice.discount = 0;
    if (isNil(this.selectedInvoice.invoice.sales_tax)) this.selectedInvoice.invoice.sales_tax = 0;
    if (isNil(this.selectedInvoice.invoice.vat)) this.selectedInvoice.invoice.vat = 0;

    this.selectedInvoice.invoice.tax = 
      this.selectedInvoice.invoice.sub_total * this.selectedInvoice.invoice.sales_tax / 100
      + this.selectedInvoice.invoice.sub_total * this.selectedInvoice.invoice.vat / 100;

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
  }

  handleCurrencyChange(event) {
    this.symbol = event.value;
    this.selectedInvoice.invoice.currency = event.value;
  }

  goBack() {
    this.router.navigate(['/orders/items']);
  }

  showProductModal() {
    this.modal
    .open(ReconcileProductModal, this.modalWindowService.overlayConfigFactoryWithParams({}));
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
      if (product.package_price !== product.reconciled_package_price) {
        product.isTooltipVisible = true;
      }
      this.selectedInvoice.invoice.calculated_sub_total = product.reconciled_total;
      this.updateInvoiceDetails({});
    } catch (err) {
      console.log('productChange: ', err);
    }
  }

  productDiscount(product) {
    if (product.reconciled_package_price > product.package_price) {
      product.reconciled_discount = 0;
      product.discounted_price = 0;
    } else {
      if (product.reconciled_discount_type == 'PERCENT') {
        product.reconciled_discount = Math.round(10000 * (product.package_price - product.reconciled_package_price) / product.package_price) / 100;
      } else {
        product.reconciled_discount = Math.round((product.package_price - product.reconciled_package_price) * 100) / 100;
      }
      product.discounted_price = product.reconciled_discounted_price;
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

    this.selectedInvoice.invoice.tax = 
      (this.selectedInvoice.invoice.sub_total * this.selectedInvoice.invoice.sales_tax / 100) || 0
      + (this.selectedInvoice.invoice.sub_total * this.selectedInvoice.invoice.vat / 100) || 0;

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

  handleInvoiceChanges(event) {
    if (isNil(this.selectedInvoice.invoice.invoice_id)) {
      const payload = this.getUpdates(false);
      this.reconcileService.updateReconcile(payload).subscribe(res => {
        this.reconcileService.lookInvoices(null).subscribe(res => {});
      });
    } else {
      let ids = '';
      if (this.selectedInvoice.items.length > 1) {
        this.selectedInvoice.items.forEach(item => {
          if (ids !== '') ids = ids.concat(',');
          ids = ids.concat(item.order_line_item_id);
        });
      } else {
        ids = this.selectedInvoice.items[0].order_line_item_id;
      }
      this.reconcileService.getReconcile(event.value, ids).subscribe(res => {
        if (isNil(res.data)) {
          this.toasterService.pop('error', 'Invoice or Order Items are already in use');
        } else {
          this.reconcileService.invoice$.next(res.data);
          this.router.navigate(['/orders/reconcile']);
        }
      });
    }
  }

  reconcileTypeChanges(event) {}

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
