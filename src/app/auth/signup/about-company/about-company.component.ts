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
  signupAccount: AccountModel;

  constructor(
      private accountService: AccountService,
      private userService: UserService,
      private spinnerService: SpinnerService,
      private router: Router
  ) {
    if (!this.userService.isGuest()){
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    this.signupAccount = new AccountModel();
  }

  onSubmit(){
    this.spinnerService.show();
    this.userService.entity$
        .subscribe((res: any) => {
          this.signupAccount.user_id = res.id;
        });

    this.accountService.createCompany(this.signupAccount)
        .subscribe((res: any) => {
          this.spinnerService.hide();
          this.router.navigate(['/signup/payment-info']);
        });
  }

}
