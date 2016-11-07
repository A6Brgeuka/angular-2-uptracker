import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { AccountService } from '../../core/services/index';

@Injectable()
export class UserCollectionResolve implements Resolve<any> {
  constructor(
      private accountService: AccountService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.getUsers();
  }
}

@Injectable()
export class RoleCollectionResolve implements Resolve<any> {
  constructor(
      private accountService: AccountService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.getRoles();
  }
}

@Injectable()
export class LocationCollectionResolve implements Resolve<any> {
  constructor(
      private accountService: AccountService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.getLocations();
  }
}

@Injectable()
export class VendorCollectionResolve implements Resolve<any> {
  constructor(
      private accountService: AccountService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.getVendors();
  }
}

// an array of services to resolve routes with data
export const ACCOUNT_RESOLVER_PROVIDERS = [
  UserCollectionResolve,
  RoleCollectionResolve,
  LocationCollectionResolve,
  VendorCollectionResolve
];