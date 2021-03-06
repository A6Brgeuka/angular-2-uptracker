import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogRef, ModalComponent, Modal } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { isNil } from 'ramda'
import * as _ from 'lodash';
import { ModalWindowService } from '../../../core/services/modal-window.service';
import { ReconcileService } from '../../../core/services/reconcile.service';
import { Subject } from 'rxjs/Subject';
import { UserService } from '../../../core/services/user.service';
import { ToasterService } from '../../../core/services/toaster.service';


export class ReconcileOnboardingModalContext extends BSModalContext {
  public orders: Array<any>;
}

@Component({
  selector: 'app-reconcile-onboarding-modal',
  templateUrl: './reconcile-onboarding-modal.component.html',
  styleUrls: ['./reconcile-onboarding-modal.component.scss']
})
@DestroySubscribers()
export class ReconcileOnboardingModal implements OnInit, ModalComponent<ReconcileOnboardingModalContext> {
  public subscribers: any = {};
  public context: any;
  public reconcileType: string = '';
  public selectConfig: any = { displayKey: "invoice_number", search: true };
  public invoices: Array<any> = [];
  public invoices_: Array<any> = [];
  public invoice_number: string = '';
  public items: Array<any> = [];

  constructor(
    public dialog: DialogRef<ReconcileOnboardingModalContext>,
    public modal: Modal,
    public modalWindowService: ModalWindowService,
    public reconcileService: ReconcileService,
    public userService: UserService,
    public router: Router,
    public toasterService: ToasterService,
  ) {
    this.context = dialog.context;
  }

  ngOnInit() {
    this.items = this.context.orders
    this.reconcileService.lookInvoices(null).subscribe(res => {
      this.invoices = res;
      if (res.length > 0) {
        this.invoices.push(res[0]);
        this.invoices_ = [res[0]];
      }
    });
  }

  continue() {
    this.dialog.dismiss();
    this.reconcileService.orders$.next(this.items);

    let ids = '';
    if (this.items.length > 1) {
      this.items.forEach(item => {
        if (ids !== '') ids = ids.concat(',');
        ids = ids.concat(item.id);
      });
    } else {
      ids = this.items[0].id;
    }

    if (this.reconcileType == 'start') {
      this.reconcileService.getReconcile(null, ids).subscribe(res => {
        if (isNil(res.data)) {
          this.toasterService.pop('error', 'Order items are in usage now.');
        } else {
          res.data.invoice.invoice_number = this.invoice_number
          res.data.invoice.invoice_date = new Date();
          this.reconcileService.invoice$.next(res.data);
          this.router.navigate(['/orders/reconcile']);
        }
      })
    } else {
      this.reconcileService.getReconcile(this.invoices_[0].invoice_id, ids).subscribe(res => {
        if (isNil(res.data)) {
          this.toasterService.pop('error', 'Invoice or Order Items are already in use');
        } else {
          this.reconcileService.invoice$.next(res.data);
          this.router.navigate(['/orders/reconcile']);
        }
      })
    }
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
  }

  invoiceChange(event) {}

  reconcile(event) {}
}
