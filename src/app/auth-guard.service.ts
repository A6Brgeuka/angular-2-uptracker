import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { UserService, StateService } from './core/services/index';
import { Observable } from 'rxjs/Rx';


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  // selfData$: Observable<any>;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean { 
    let url: string = state.url;
    let location = url.split('/')[1];
    switch (location) {
      case 'signup':
        return this.checkSignup();
      case 'onboard':
        return this.checkLogin(url);
      case 'dashboard':
        return this.checkLoginAndOnboard(url);
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.canActivate(route, state);
  }

  checkSignup() {
    let user$ = this.userService.getSelfData().map((res) => {
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
    });

    return user$;



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

  checkLogin(url: string): boolean {
    if (!this.userService.isGuest() && this.userService.emailVerified()) { return true; }

    this.navigate(url);
  }

  checkLoginAndOnboard(url: string): boolean {
    //let onboardRouteCondition this.userService.selfData ? this.userService.selfData.onboard || false : false;
    let onboardRouteCondition = true;

    if (!this.userService.isGuest() && onboardRouteCondition) { return true; }

    this.navigate(url);
  }

  navigate(url: string) {
    // Store the attempted URL for redirecting
    this.userService.redirectUrl = url;

    // Navigate to the login page if guest
    if (this.userService.isGuest()) {
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
}