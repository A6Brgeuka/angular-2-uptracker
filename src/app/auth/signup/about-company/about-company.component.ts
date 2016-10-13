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
      // TODO:
      // check response and add account_id to condition
      // if user is logged in and created company (have account_id) redirect him
      // if (!this.userService.isGuest() && this.userService.selfData.account_id){
      //   this.router.navigate(['/dashboard']);
      // }
    // });

    let signupStep = this.userService.currentSignupStep();

    if (signupStep == 1) {
      this.router.navigate(['/signup']);
    }
  }

  ngOnInit() {
    // check for user_id
    this.signupAccount.user_id = this.userService.getSelfIdFromSelfData()
    if (this.userService.selfData.account) {
      this.signupAccount = {
        user_id: this.signupAccount.user_id,
        id: this.userService.selfData.account.id,
        company_name: this.userService.selfData.account.company_name,
        company_email: this.userService.selfData.account.contact_email_address,
        street_1: this.userService.selfData.account.address.street_1,
        street_2: this.userService.selfData.account.address.street_2,
        city: this.userService.selfData.account.address.city,
        zip: this.userService.selfData.account.address.postal_code,
        marys_list_member: this.userService.selfData.account.marys_list_member
      };
    }
  }

  onSubmit(){
    this.spinnerService.show();

    this.accountService.createCompany(this.signupAccount)
        .subscribe((res: any) => { 
          let user = this.userService.transformAccountInfo(res.data);
          this.userService.updateSelfData(user);
          this.router.navigate(['/signup/payment-info']);
        });
  }

}
