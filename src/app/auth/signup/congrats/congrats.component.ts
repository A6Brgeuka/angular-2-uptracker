import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService, CardService, AccountService } from '../../../core/services/index';

@Component({
  selector: 'app-congrats',
  templateUrl: './congrats.component.html',
  styleUrls: ['./congrats.component.scss']
})
export class CongratsComponent {
  signupAccount: any = {
    account: {},
    user: {},
    card: {}
  };

  constructor(
      private userService: UserService,
      private accountService: AccountService,
      private cardService: CardService,
      private router: Router
  ) {
    // if payment token doesn't exist then redirect user to dashboard (guest will be automatically redirected to login)
    let payment_token = this.accountService.selfData ? this.userService.selfData.id || null : null;
    if (!payment_token){
      this.router.navigate(['/dashboard']);
    }
  }
}
