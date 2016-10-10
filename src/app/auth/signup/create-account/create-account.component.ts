import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/services';

import { UserModel } from '../../../models/index';
import { UserService, SpinnerService } from '../../../core/services/index';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {
  signupAccount: UserModel;
  public phoneMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/ ];
  inernationalPhoneMask = [ /\+/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/ ];
  usPhoneMask = ['+', '1', ' ', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/ ];
  terms: boolean = false;
  privacy: boolean = false;

  signupFormPhone: string = '';
  selectedCountry: any = [];

  constructor(
      private userService: UserService,
      private router: Router,
      private spinnerService: SpinnerService,
      private cookieService: CookieService
  ) {
    if (!this.userService.isGuest()){
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    this.signupAccount = this.userService.selfData || new UserModel();
    // debugger;
  }

  onSubmit(){
    // this.signupAccount.phone = this.selectedCountry[2] + ' ' + this.signupFormPhone;
    this.spinnerService.show();
    this.userService.signUp(this.signupAccount)
        .subscribe(
            (res: any) => {
              this.spinnerService.hide();
              this.router.navigate(['/signup/about-company']);
            },
            (err) => {}
        );
  }

  viewTerms(){
    this.terms = true;
  }

  viewPrivacy(){
    this.privacy = true;
  }

  closeText(){
    this.terms = false;
    this.privacy = false;
  }

}
