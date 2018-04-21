import { Component, OnInit } from '@angular/core';

import { DialogRef, ModalComponent, Modal } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import * as _ from 'lodash';
import { ModalWindowService } from '../../../core/services/modal-window.service';
import { ReconcileService } from '../../../core/services/reconcile.service';
import { Subject } from 'rxjs/Subject';
import { UserService } from '../../../core/services/user.service';
import { Router } from '@angular/router';

export class ReconcileOnboardingModalContext extends BSModalContext {
  public order: any;
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
  public selectConfig: any = { displayKey: "id", search: true, selectedDisplayText: 'Select Invoice' };
  public invoices: Array<any> = [];
  public invoices_: Array<any> = [];

  constructor(
    public dialog: DialogRef<ReconcileOnboardingModalContext>,
    public modal: Modal,
    public modalWindowService: ModalWindowService,
    public reconcileService: ReconcileService,
    public userService: UserService,
    public router: Router,
  ) {
    this.context = dialog.context;
  }

  ngOnInit() {
    console.log(this.context, 'Resend context');
    this.reconcileService.getReconcile().subscribe(res => {
      res.id = '5ad4f32e3d0192000d3acf1e';

      this.invoices = [res];
      // this.invoices_ = _.cloneDeep(this.invoices);
    })
  }

  continue() {
    this.dialog.dismiss();

    if (this.reconcileType == 'start') {
      this.router.navigate(['/orders/reconcile']);
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
