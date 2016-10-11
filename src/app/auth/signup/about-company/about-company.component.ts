import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserModel, AccountModel } from '../../../models/index';
import { AccountService, UserService, SpinnerService } from '../../../core/services/index';

@Component({
  selector: 'app-about-company',
  templateUrl: './about-company.component.html',
  styleUrls: ['./about-company.component.scss']
})
export class AboutCompanyComponent implements OnInit {
  signupAccount: any = {};
  private userSubscription: any = null;
  private accountSubscription: any = null;

  constructor(
      private accountService: AccountService,
      private userService: UserService,
      private spinnerService: SpinnerService,
      private router: Router
  ) {
    // this.userService.loadSelfData().subscribe((res: any) => {
    //   // TODO:
    //   // check response and add account_id to condition
    //   // if user is logged in and created company (have account_id) redirect him
    //   debugger;
    //   if (!this.userService.isGuest() && res.account_id){
    //     this.router.navigate(['/dashboard']);
    //   }
    // });

    // check for user_id
    this.signupAccount.user_id = this.userService.getSelfIdFromSelfData();

    // if guest (user without id) then redirect him to login page
    if (!this.signupAccount.user_id) {
      this.router.navigate(['/login']);
    }

    // check for account
    // if user is logged in and created company (have account_id) redirect him
    let account_id = this.userService.selfData ? this.userService.selfData.account_id || null : null;
    if (!this.userService.isGuest() && account_id){
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    let self = this;
    this.accountSubscription = this.accountService.entity$
        .subscribe((res) => {
          self.signupAccount = {
            user_id: self.signupAccount.user_id,
            id: res.id,
            company_name: res.company_name,
            company_email: res.contact_email_address,
            street_1: res.address.street_1,
            street_2: res.address.street_2,
            city: res.address.city,
            zip: res.address.postal_code,
            marys_list_member: res.marys_list_member
          };
        });
  }

  ngOnDestroy() {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
  }

  onSubmit(){
    this.spinnerService.show();

    this.accountService.createCompany(this.signupAccount)
        .subscribe((res: any) => {
          this.spinnerService.hide();
          this.router.navigate(['/signup/payment-info']);
        });
  }

}
