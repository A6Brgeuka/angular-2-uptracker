import { Component, OnInit, ElementRef, ViewContainerRef } from '@angular/core';
// import { UserModel } from '../../models/index';
// import { UserService } from '../../core/services/index';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';

import { LocationModal } from './location-modal/location-modal.component';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
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
    this.modal.open(LocationModal,  overlayConfigFactory({ num1: 2, num2: 3 }, BSModalContext));
  }

}
