import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { UserService, StateService } from './core/services/index';
import { UserModel } from './models/index';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  selfData: any;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    let user$ = this.userService.loadSelfData().map((res) => {
      // if guest remove self data
      if (this.userService.isGuest()){
        this.userService.updateSelfData(new UserModel());
      }
      this.selfData = res;
      let url: string = state.url;
      let location = url.split('/')[1];
      switch (location) {
        case 'login':
          return this.checkLogin();
        case 'forgot-password':
          return this.checkForgotPassword();
        case 'signup':
          return this.checkSignup();
        case 'onboard':
          return this.checkOnboard(url);
        case 'dashboard':
          return this.checkDashboard(url);
        default:
          return true;
      }
    });

    return user$;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.canActivate(route, state);
  }

  checkSignup() {
    if (this.userService.isGuest()) {
      return true;
    }

    if (this.userService.emailVerified()) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    if (!this.userService.emailVerified() && this.userService.currentSignupStep() == 4) {
      this.router.navigate(['/email-verification']);
      return false;
    }

    return true;



    // TODO: remove when test
    // if (this.userService.emailVerified()) {
    //   this.router.navigate(['/dashboard']);
    //   return false;
    // }
    //
    // if (!this.userService.emailVerified() && this.userService.currentSignupStep() == 4) {
    //   this.router.navigate(['/email-verification']);
    //   return false;
    // }
    //
    // return true;
  }

  checkOnboard(url: string): boolean {
    if (!this.checkAuth(url)) {
      return false;
    }

    return true;
  }

  checkDashboard(url: string): boolean {
    if (!this.checkAuth(url)) {
      return false;
    }

    let account_status = this.userService.selfData.account.status || null;

    if (account_status != 2) {
      this.router.navigate(['/onboard','locations']);
      return false;
    }

    return true;
  }

  checkAuth(url: string) {
    // Store the attempted URL for redirecting
    this.userService.redirectUrl = url;

    // Navigate to the login page if guest
    if (this.userService.isGuest() || !this.userService.selfData) {
      this.router.navigate(['/login']);
      return false;
    }

    if (!this.userService.emailVerified()) {
      // check for passing signup steps for navigation
      let signupStep = this.userService.currentSignupStep();
      switch(signupStep) {
        case 2:   this.router.navigate(['/signup', 'about-company']); return;
        case 3:   this.router.navigate(['/signup', 'payment-info']); return;
        case 4:   this.router.navigate(['/email-verification']); return;
        default:  this.router.navigate(['/signup']);
      }
      return false;
    }

    return true;
  }

  checkLogin(){
    if (!this.userService.isGuest()){
      this.router.navigate(['/dashboard']);
      return false;
    }
    
    return true;
  }
  
  checkForgotPassword(){
    return this.checkLogin();
  }
}