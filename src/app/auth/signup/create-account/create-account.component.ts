import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
      private router: Router
  ) { }

  ngOnInit() {
    this.signupAccount = new UserModel();
  }

  onSubmit(){
    this.userService.signUp(this.signupAccount)
        .subscribe((res: any) => {
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
