import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';

import { LocationModal } from './location-modal/location-modal.component';
// import { UserModel } from '../../models/index';
// import { UserService } from '../../core/services/index';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  constructor(
      private router: Router,
      vcRef: ViewContainerRef,
      overlay: Overlay,
      public modal: Modal
  ) {
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
  }

  viewLocationModal(){
    this.modal.open(LocationModal,  overlayConfigFactory(BSModalContext));
  }

  goNext(){
    this.router.navigate(['/onboard','users']);
  }

}
