import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { AccountService } from '../../core/services/index';

@Injectable()
export class CurrencyCollectionResolve implements Resolve<any> {
  constructor(
      private accountService: AccountService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.getCurrencies();
  }
}

// an array of services to resolve routes with data
export const ACCOUNTING_RESOLVER_PROVIDERS = [
  CurrencyCollectionResolve
];