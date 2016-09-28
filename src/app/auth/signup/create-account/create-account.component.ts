import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/services';

import { UserModel } from '../../../models/index';
import { UserService } from '../../../core/services/index';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {
  signupAccount: UserModel;
  // public mask = ['+', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/ ];
  terms: boolean = false;
  privacy: boolean = false;

  constructor(
      private userService: UserService,
      private router: Router,
      private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.signupAccount = new UserModel();
  }

  onSubmit(){
    this.userService.signUp(this.signupAccount)
        .subscribe((res: any) => {
          this.cookieService.put('uptracker_token', res.token);
          this.router.navigate(['/signup/about-company']);
        });
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
