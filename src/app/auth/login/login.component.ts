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
    // this.spinnerService.toggleLoadingIndicator(true);
  }

  onSubmit() {
    this.userService.login(this.loginUser)
        .subscribe((res: any) => {
          if (res.data.user.user.account_id) {
            this.router.navigate(['/dashboard']);
          } else {
            // remove selfId to pass isGuest condition on about-company component
            this.cookieService.remove('uptracker_selfId');
            this.router.navigate(['/signup', 'about-company']);
          }
        });
  }

}
