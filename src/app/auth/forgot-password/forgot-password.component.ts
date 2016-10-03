import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, ToasterService, SpinnerService } from '../../core/services/index';

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
      private router: Router,
      private spinnerService: SpinnerService
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
    this.spinnerService.show();
    this.userService.forgotPasswordRequest(this.draftUser)
        .subscribe((res: any) => {
          this.spinnerService.hide();
          this.router.navigate(['/forgot-password-congrats']);
        });
  }

}
