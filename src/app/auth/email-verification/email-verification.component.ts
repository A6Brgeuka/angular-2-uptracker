import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService, ToasterService, SpinnerService } from '../../core/services/index';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit {
  tokenParam: string;
  buttonDisabled: boolean = false;

  constructor(
      private activatedRoute: ActivatedRoute,
      private userService: UserService,
      private toasterService: ToasterService,
      private spinnerService: SpinnerService,
      private router: Router
  ) {
    let signupStep = this.userService.currentSignupStep();
    if (signupStep && signupStep < 4) {
      this.router.navigate(['/signup']);
    }
  }

  ngOnInit() {
    this.activatedRoute.params.forEach((params: Params) => {
      this.tokenParam = params['token'] || null;
    });

    // if empty token then no need to validate email
    if (!this.tokenParam) {
      return;
    }

    // email validation
    this.userService.verification(this.tokenParam)
        .subscribe(
            (res: any) => {
              this.router.navigate(['/onboard', 'locations']);
            },
            (err) => {
              this.router.navigate(['/login']);
            }
        );
  }
  
  onResend() {
    this.userService.resendVerification()
        .subscribe(
            (res: any) => {
              this.toasterService.pop('', res.message);
              this.buttonDisabled = true;
              // this.router.navigate(['/login']);
            },
            (err) => {
              this.userService.logout('/login');
            }
        );
  }

}
