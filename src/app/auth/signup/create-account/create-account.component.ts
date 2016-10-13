import { Component, OnInit } from '@angular/core';
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
  // usPhoneMask = ['+', '1', ' ', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/ ];
  terms: boolean = false;
  privacy: boolean = false;

  signupFormPhone: string = '';
  selectedCountry: any = [];
  temp;

  constructor(
      private userService: UserService,
      private router: Router,
      private spinnerService: SpinnerService,
      private cookieService: CookieService
  ) {
  }

  ngOnInit() {
    this.signupAccount = this.userService.selfData || new UserModel();
    
    // default country for phone input
    this.selectedCountry = [ "United States", "us", "1", 0 ];
  }

  onCountryChange($event) {
    // TODO: change phone mask dynamically if necessary
    // this.phoneMask = [ /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/ ];
    // let codeArr = country[2].split('');
    // codeArr.unshift('+');
    // codeArr.push(' ', ' ');
    // this.phoneMask = codeArr.concat(this.phoneMask);
    this.selectedCountry = $event;
  }

  onSubmit(){
    this.signupAccount.phone = this.selectedCountry[2] + ' ' + this.signupFormPhone;
    this.spinnerService.show();
    this.userService.signUp(this.signupAccount)
        .subscribe(
            (res: any) => {
              if (res.data.token)
                this.cookieService.put('uptracker_token', res.data.token);
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
