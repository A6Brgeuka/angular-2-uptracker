import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, ToasterService } from '../../core/services/index';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  draftUser;

  constructor(
      private userService: UserService,
      private toasterService: ToasterService,
      private router: Router
  ) {
    if (!this.userService.isGuest()){
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    this.draftUser = {
      email_address: ''
    };
  }

  onSubmit() {
    this.userService.forgotPasswordRequest(this.draftUser)
        .subscribe((res: any) => {
          // this.toasterService.pop('', 'Forgotten password request sent.');
          this.router.navigate(['/forgot-password-congrats']);
        });
  }

}
