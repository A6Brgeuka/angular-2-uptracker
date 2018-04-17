import { Component, OnInit } from '@angular/core';

import { DialogRef, ModalComponent, Modal } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { ModalWindowService } from '../../../core/services/modal-window.service';
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

  constructor(
    public dialog: DialogRef<ReconcileOnboardingModalContext>,
    public modal: Modal,
    public modalWindowService: ModalWindowService,
    public userService: UserService,
    public router: Router,
  ) {
    this.context = dialog.context;
  }

  ngOnInit() {
    console.log(this.context, 'Resend context');
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
  }

  reconcile(event) {
    console.log('------------->>>>   ', this.reconcileType);
  }
}
