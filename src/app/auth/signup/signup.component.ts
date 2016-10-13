import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../core/services/index';

@Component({
  selector: 'app-signup',
  styleUrls: [ './signup.style.scss' ],
  templateUrl: './signup.template.html'
})
export class SignupComponent implements OnInit{

  constructor(
      private userService: UserService,
      private router: Router
  ) {
  }
  
  ngOnInit(){
    if (!this.userService.currentSignupStep() || this.userService.currentSignupStep() == 4) {
      this.router.navigate(['/dashboard']);
    }
  }

}
