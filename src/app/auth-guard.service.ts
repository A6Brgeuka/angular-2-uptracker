import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { UserService, StateService } from './core/services/index';


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private userService: UserService,
    private router: Router
  ) {
  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    let url: string = state.url;
    let location = url.split('/')[1];
    switch (location) {
      case 'onboard': return this.checkLogin(url);
      case 'dashboard': return this.checkLoginAndOnboard(url);
    }

  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
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

    if (!this.userService.emailVerified() && this.userService.currentSignupStep()==4) {
      this.router.navigate(['/email-verification']);
      return false;
    }

    if (!this.userService.emailVerified()) {
      this.router.navigate(['/signup']);
      return false;
    }
  }
}