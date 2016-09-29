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
  loginUser = {
    email: '',
    password: ''
  };

  constructor(
      private userService: UserService,
      private router: Router
  ) {
    if (!this.userService.isGuest()){
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
  }

  onSubmit() {
    this.userService.login(this.loginUser)
        .subscribe((res: any) => {
          this.router.navigate(['/dashboard']);
        });
  }

}
