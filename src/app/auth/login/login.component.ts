import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService, SpinnerService } from '../../core/services/index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginUser = {
    email: '',
    password: ''
  };

  constructor(
      private userService: UserService,
      private router: Router,
      private spinnerService: SpinnerService
  ) {
    if (!this.userService.isGuest()){
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    this.spinnerService.show();
    this.userService.login(this.loginUser)
        .subscribe(
            (res: any) => {
              // Get the redirect URL from service
              // If no redirect has been set, use the default
              let redirect = this.userService.redirectUrl ? this.userService.redirectUrl : '/dashboard';

              // check for passing signup steps for navigation
              let signupStep = this.userService.currentSignupStep();
              switch(signupStep) {
                case 2:   this.router.navigate(['/signup', 'about-company']); return;
                case 3:   this.router.navigate(['/signup', 'payment-info']); return;
                case 4:   this.router.navigate(['/email-verification']); return;
                default:  this.router.navigate([redirect]);
              }
            }
        );
  }
}
