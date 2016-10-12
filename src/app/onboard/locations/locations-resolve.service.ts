import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { AccountService } from '../../core/services/index';

@Injectable()
export class StateCollectionResolve implements Resolve<any> {
  constructor(
      private accountService: AccountService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.getStates();
  }
}

@Injectable()
export class LocationTypesCollectionResolve implements Resolve<any> {
  constructor(
      private accountService: AccountService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.getLocationTypes();
  }
}

// an array of services to resolve routes with data
export const LOCATIONS_RESOLVER_PROVIDERS = [
  StateCollectionResolve,
  LocationTypesCollectionResolve
];