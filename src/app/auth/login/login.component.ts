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
      private userService: UserService,
      private router: Router
  ) { }

  ngOnInit() {
    this.draftUser = new UserModel({});
  }

  onSubmit() {
    this.userService.login(this.draftUser)
        .subscribe((res: any) => {
          this.router.navigate(['/dashboard']);
        });
  }

}
