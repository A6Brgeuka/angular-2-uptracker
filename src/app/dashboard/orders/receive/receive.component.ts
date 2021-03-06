import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Location } from '@angular/common';

import { DestroySubscribers } from 'ngx-destroy-subscribers';

import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ConfirmModalService } from '../../../shared/modals/confirm-modal/confirm-modal.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { ReceivedOrderService } from '../../../core/services/received-order.service';

import { ReceiveFormGroup, ReceiveFormModel } from './models/receive-form.model';
import { ReceiveService } from './receive.service';


@Component({
  selector: 'app-order-detail',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
@DestroySubscribers()
export class ReceiveComponent implements OnInit, OnDestroy {

  public saveReceiveProducts$: ReplaySubject<ReceiveFormModel> = new ReplaySubject(1);

  public openConfirmModal$: Subject<any> = new Subject();

  public receiveOrdersForm: FormGroup;

  public invoice$: Observable<any>;

  public formSubmitted$: Observable<boolean>;

  private createInventorySubject$: Subject<boolean> = new Subject();

  private subscribers: any = {};

  constructor(
    public receivedOrderService: ReceivedOrderService,
    public toasterService: ToasterService,
    public route: ActivatedRoute,
    public router: Router,
    public receiveService: ReceiveService,
    public location: Location,
    public confirmModalService: ConfirmModalService,
  ) {
  }

  get vendorName() {
    const control = this.receiveOrdersForm.get(['vendor', 'vendor_name']);
    return control && control.value;
  }

  get packingSlipNumberControl() {
    return this.receiveOrdersForm.get('packing_slip_number');
  }

  get invoiceNumberControl() {
    return this.receiveOrdersForm.get('invoice_number');
  }

  ngOnInit() {

    this.invoice$ = Observable.merge(
      this.route.params,
      this.createInventorySubject$
      .switchMapTo(
        this.route.params
        .take(1)
      ),
    )
    .switchMap((params) => this.receiveService.takeInvoiceData(params));

    this.formSubmitted$ = this.receiveService.formSubmitted$;

  }

  ngOnDestroy() {
    this.receiveService.formSubmitted(false);
    this.receiveOrdersForm = null;
    console.log('for unsubscribing');
  }

  createForm(invoice) {
    this.receiveOrdersForm = new ReceiveFormGroup(invoice);
  }

  addSubscribers() {

    this.subscribers.getReceiveProductSubscription = this.invoice$
    .subscribe((res: any) => {
      this.createForm(res);
    });

    this.subscribers.saveReceiveProductSubscription = this.saveReceiveProducts$
    .switchMap((data) =>
      this.receivedOrderService.onReceiveProducts(data)
      .catch((error) => {
        console.error(error);
        return Observable.never();
      })
    )
    .subscribe(() => {
      this.toasterService.pop('', 'Successfully received');
      this.router.navigate(['orders', 'items']);
    });

    this.subscribers.openConfirmModalSubscription = this.openConfirmModal$
    .switchMap(() => this.confirmModalService.confirmModal(
      'Save?',
      'You are about to leave without saving changes. Are you sure you want to exit?',
      [
          {text: 'Exit', value: 'exit', red: true},
          {text: 'Cancel', value: 'cancel', cancel: true},
          {text: 'Save', value: 'save'},
        ]
    ))
    .filter((ev) => ev.success)
    .subscribe((ev) => {
      switch (ev.data) {
        case 'save': {
          this.save();
          break;
        }
        case 'exit': {
          this.router.navigate(['orders', 'items']);
          break;
        }
      }
    });

  }

  updateInvoice() {
    this.createInventorySubject$.next(null);
  }

  goBack() {
    this.openConfirmModal$.next('');
  }

  save() {
    this.receiveService.formSubmitted();
    console.log('Save will be implemented later');
    console.log(this.receiveOrdersForm.value);
    console.log(this.receiveOrdersForm);
    if (this.receiveOrdersForm.valid) {
      this.saveReceiveProducts$.next(this.receiveOrdersForm.value);
    } else {
      this.toasterService.pop('error', 'Form is invalid. Couldn\'t save');
    }
  }

}
