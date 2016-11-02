import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import {Observable, Subject, BehaviorSubject} from 'rxjs/Rx';

import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as lodashSortBy from 'lodash/sortBy';
import * as lodashMap from 'lodash/map';
import * as lodashReject from 'lodash/reject';

import { EditLocationModal } from '../../shared/modals/index';
import { ViewLocationModal } from './view-location-modal/view-location-modal.component';
import { UserService, AccountService } from '../../core/services/index';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
@DestroySubscribers()
export class LocationsComponent implements OnInit {
  public locationArr: any = [];
  private subscribers: any = {};
  public searchKey: string = null;
  private searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public sortBy: string;
  private sortBy$: BehaviorSubject<any> = new BehaviorSubject(null);
  private locations$: Observable<any>;

  constructor(
      private router: Router,
      vcRef: ViewContainerRef,
      overlay: Overlay,
      public modal: Modal,
      private userService: UserService,
      private accountService: AccountService
  ) {
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
    this.subscribers.locationsSubscription = Observable
        .combineLatest(
          this.userService.selfData$,
          this.sortBy$,
          this.searchKey$
        )
        .map(([user, sortBy, searchKey]) => {
          let filteredLocations = user.account.locations;
          if (searchKey && searchKey!='') {
            filteredLocations = lodashReject(filteredLocations, (loc: any) =>{
              let key = new RegExp(searchKey);
              return !key.test(loc.name);
            });
          }
          return lodashSortBy(filteredLocations, [sortBy]);
        })
        .subscribe((res: any) => {
          this.locationArr = res;
        });
  }

  viewLocationModal(location = null){
    this.modal
        .open(ViewLocationModal,  overlayConfigFactory({ location: location }, BSModalContext))
        .then((resultPromise)=>{
          resultPromise.result.then(
              (res) => {
                this.editLocationModal(res);
              },
              (err)=>{}
          );
        });
  }

  editLocationModal(location = null){
    this.modal.open(EditLocationModal,  overlayConfigFactory({ location: location }, BSModalContext));
  }

  locationsSort(event){
    let value = event.target.value;
    this.sortBy$.next(value);
  }

  locationsFilter(event){
    let value = event.target.value;
    this.searchKey$.next(value);
  }

}
