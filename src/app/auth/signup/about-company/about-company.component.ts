import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserModel, AccountModel } from '../../../models/index';
import { AccountService, UserService } from '../../../core/services/index';

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
      private router: Router
  ) { }

  ngOnInit() {
    this.signupAccount = new AccountModel();
  }

  onSubmit(){
    this.accountService.createCompany(this.signupAccount)
        .subscribe((res: any) => {
          console.log(1111111111111);
          console.log(res);
          this.router.navigate(['/signup/payment-info']);
        });
  }

}
