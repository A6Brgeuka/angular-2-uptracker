import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { AccountService, VendorService } from '../../core/services/index';

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
    return this.accountService.getRoles().take(1);
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
export class AccountVendorCollectionResolve implements Resolve<any> {
  constructor(
      private vendorService: VendorService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.vendorService.getAccountVendors().take(1);
  }
}

// an array of services to resolve routes with data
export const ACCOUNT_RESOLVER_PROVIDERS = [
  UserCollectionResolve,
  RoleCollectionResolve,
  LocationCollectionResolve,
  AccountVendorCollectionResolve
];