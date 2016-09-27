import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, ToasterService } from '../../core/services/index';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  userPass = {
    password: '',
    password2: ''
  };
  updateData = {
    user_id: '',
    fp_token: '',
    password: ''
  };

  constructor(
      private userService: UserService,
      private toasterService: ToasterService,
      private router: Router
  ) {
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.userPass.password != this.userPass.password2) {
      this.toasterService.pop('error', 'The passwords should be similar.');
    } else {
      this.updateData.password = this.userPass.password;

      this.userService.updatePassword(this.updateData)
          .subscribe((res:any) => {
            this.toasterService.pop('', res.message);
            this.router.navigate(['/login']);
          });
    }
  }

}
