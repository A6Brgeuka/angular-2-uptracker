import { Component, OnInit } from '@angular/core';
import { Location }                 from '@angular/common';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as _ from 'lodash';

import { AccountService, UserService, ModalWindowService } from '../../../core/services/index';
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
@DestroySubscribers()
export class ViewUserComponent implements OnInit {
  public subscribers: any = {};
  public user: any;
  public userId: string;
  public message: any = {};
  public messageConfirm: boolean = false;
  public toSendMessage: boolean = false;
  public userLocations;
  
  constructor(
    public router:Router,
    public location: Location,
    public userService: UserService,
    public accountService: AccountService,
    public route: ActivatedRoute,
    public modalWindowService: ModalWindowService
  ) {
  }
  
  ngOnInit() {
    Observable.combineLatest(
      this.route.params,
      this.userService.selfData$
    )
    .map(([params, selfData]) => {
      this.userId = params['id'];
      return selfData.account.users;
    })
    .subscribe(user => {
      this.user = _.find(user, (us: any) => (us.id == this.userId));
      this.userLocations = _.filter(this.accountService.selfData.locations, (location: any) => {
        let userLocation: any = _.find(this.user.locations, {location_id: location.id});
        if (userLocation) {
          return userLocation.checked;
        }
        return false;
      });
    });
    //ToDO
    //this.toSendMessage = userData.sendMessage || false;
  }
  
  deleteUser(user) {
    this.modalWindowService.confirmModal('Delete user?', 'Are you sure you want to delete the user?', this.deleteUserFunc.bind(this));
  }
  
  deleteUserFunc() {
    this.subscribers.deleteUserSubscription = this.accountService.deleteUser(this.user).subscribe((res: any) => {
        this.goBack();
      },
      (err: any) => {
        this.goBack();
      });
  }
  
  confirmMessage() {
    this.messageConfirm = true;
  }
  
  sendNewMessage() {
    this.message = {};
    this.messageConfirm = false;
  }
  
  goBack(): void {
    this.router.navigate(['/users']);
  }
  
}
