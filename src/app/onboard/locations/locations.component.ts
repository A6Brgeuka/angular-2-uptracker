import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable } from 'rxjs/Rx';

import { EditLocationModal } from '../../shared/modals/index';
import { UserService } from '../../core/services/index';

@Component({
  selector: 'app-onboard-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
@DestroySubscribers()
export class OnboardLocationsComponent implements OnInit {
  public locations$: Observable<any>;

  constructor(
      private router: Router,
      vcRef: ViewContainerRef,
      overlay: Overlay,
      public modal: Modal,
      private userService: UserService
  ) {
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
    this.locations$ = this.userService.selfData$
        .filter(() => {
          return !this.userService.isGuest();
        })
        .map(res => res.account.locations);
  }

  viewLocationModal(location = null){
    this.modal.open(EditLocationModal,  overlayConfigFactory({ location: location }, BSModalContext));
  }

  goNext(){
    this.router.navigate(['/onboard','users']);
  }


}
