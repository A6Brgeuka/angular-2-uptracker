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

// an array of services to resolve routes with data
export const APP_RESOLVER_PROVIDERS = [
  StateCollectionResolve
];