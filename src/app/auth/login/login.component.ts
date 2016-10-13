import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/services';

import { UserModel } from '../../models/index';
import { UserService, SpinnerService } from '../../core/services/index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginUser = {
    email: '',
    password: ''
  };

  constructor(
      private userService: UserService,
      private router: Router,
      private cookieService: CookieService,
      private spinnerService: SpinnerService
  ) {
    if (!this.userService.isGuest()){
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {

  }

  onSubmit() {
    this.spinnerService.show();
    this.userService.login(this.loginUser)
        .subscribe(
            (res: any) => {
              this.spinnerService.hide();
              // check for passing signup steps for navigation
              if (!res.data.user.user.account_id) {
                this.router.navigate(['/signup', 'about-company']);
                return;
              }
              if (!res.data.user.user.account.payment_token && !res.data.user.user.account.trial_code) {
                this.router.navigate(['/signup', 'payment-info']);
                return;
              }
              this.router.navigate(['/dashboard']);
            }
        );
  }
}
