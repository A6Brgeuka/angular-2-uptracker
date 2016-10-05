import { Component, OnInit, ElementRef, ViewContainerRef } from '@angular/core';
// import { UserModel } from '../../models/index';
// import { UserService } from '../../core/services/index';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';

import { UserModal } from './user-modal/user-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  constructor(
      vcRef: ViewContainerRef,
      overlay: Overlay,
      public modal: Modal
  ) {
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
  }

  viewLocationModal(){
    this.modal.open(UserModal,  overlayConfigFactory(BSModalContext));
  }

}
