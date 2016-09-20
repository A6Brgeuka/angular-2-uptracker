import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from '../../models/index';
import { UserService } from '../../core/services/index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  draftUser: UserModel;

  constructor(
      // private userService: UserService,
      private router: Router
  ) { }

  ngOnInit() {
    this.draftUser = new UserModel({});
  }

  onSubmit() {
    // this.userService.login(this.draftUser)
    //     .subscribe((res: any) => {
    //       console.log(res);
    //       // if (res.typeAuthenticationString == 'sms') {
    //       //   this.populateModel(res);
    //       // } else {
    //       //   this.router.navigate(['/deployments']);
    //       // }
    //       this.router.navigate(['/reset-password']);
    //     });
  }

}
