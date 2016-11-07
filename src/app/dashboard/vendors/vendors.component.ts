import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

// import { Overlay, overlayConfigFactory } from 'angular2-modal';
// import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as _ from 'lodash';

// import { ViewUserModal } from './view-user-modal/view-user-modal.component';
// import { EditUserModal } from '../../shared/modals/index';
import { UserService, AccountService } from '../../core/services/index';


@Component({
  selector: 'app-users',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
@DestroySubscribers()
export class VendorsComponent implements OnInit {
  public vendorArr: any = [];
  private subscribers: any = {};
  public searchKey: string = null;
  private searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public total: number;

  constructor(
      vcRef: ViewContainerRef,
      // overlay: Overlay,
      // public modal: Modal,
      private userService: UserService,
      private accountService: AccountService
  ) {
    // overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
    this.subscribers.getUsersSubscription = Observable
        .combineLatest(
            this.userService.selfData$,
            this.searchKey$
        )
        .map(([user, searchKey]) => {
          this.total = user.account.users.length;
          let filteredVendors = user.account.users;
          if (searchKey && searchKey!='') {
            filteredVendors = _.reject(filteredVendors, (user: any) =>{ 
              let key = new RegExp(searchKey, 'i');
              return !key.test(user.name);
            });
          }
          return filteredVendors;
        })
        .subscribe((res: any) => {
          this.vendorArr = res;
        });
  }

  // viewUserModal(user = null){
  //   this.modal
  //       .open(ViewUserModal,  overlayConfigFactory({ user: user }, BSModalContext))
  //       .then((resultPromise)=>{
  //         resultPromise.result.then(
  //             (res) => {
  //               this.editUserModal(res);
  //             },
  //             (err)=>{}
  //         );
  //       });
  // }
  //
  // editUserModal(user = null){
  //   this.modal.open(EditUserModal,  overlayConfigFactory({ user: user }, BSModalContext));
  // }

  vendorsFilter(event){
    let value = event.target.value;
    this.searchKey$.next(value);
  }

}
