import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { AccountService, UserService } from '../../core/services/index';

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
export class DepartmentCollectionResolve implements Resolve<any> {
  constructor(
      private accountService: AccountService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.getDepartments();
  }
}

@Injectable()
export class RoleCollectionResolve implements Resolve<any> {
  constructor(
      private accountService: AccountService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // this.accountService.getRoles().subscribe();
    return this.accountService.getRoles();
  }
}

// an array of services to resolve routes with data
export const USERS_RESOLVER_PROVIDERS = [
  UserCollectionResolve,
  DepartmentCollectionResolve,
  RoleCollectionResolve
];