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
              let signupStep = this.userService.currentSignupStep();
              switch(signupStep) {
                case 2:  this.router.navigate(['/signup', 'about-company']); return;
                case 3:  this.router.navigate(['/signup', 'payment-info']); return;
                case 4:  this.router.navigate(['/']); return;
                default:this.router.navigate(['/dashboard']);
              }
            }
        );
  }
}
