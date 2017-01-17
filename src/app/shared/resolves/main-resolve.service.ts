import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { AccountService, VendorService, ProductService } from '../../core/services/index';
import { LocationService } from "../../core/services/location.service";

@Injectable()
export class StateCollectionResolve implements Resolve<any> {
  constructor(
      private accountService: AccountService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.getStates().take(1);
  }
}

@Injectable()
export class LocationTypesCollectionResolve implements Resolve<any> {
  constructor(
      private locationService: LocationService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.locationService.getLocationTypes().take(1);
  }
}

@Injectable()
export class DepartmentCollectionResolve implements Resolve<any> {
  constructor(
      private accountService: AccountService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.getDepartments().take(1);
  }
}

@Injectable()
export class CurrencyCollectionResolve implements Resolve<any> {
  constructor(
      private accountService: AccountService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.getCurrencies().take(1);
  }
}

@Injectable()
export class VendorCollectionResolve implements Resolve<any> {
  constructor(
      private vendorService: VendorService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.vendorService.getVendors().take(1);
  }
}

@Injectable()
export class ProductCollectionResolve implements Resolve<any> {
  constructor(
      private productService: ProductService,
      private accountService: AccountService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    debugger;
    return this.accountService.dashboardLocation$.switchMap((res) => {
      this.productService.getProducts().take(1)
    });
    //return this.productService.getProducts().take(1);
  }
}

// an array of services to resolve routes with data
export const MAIN_RESOLVER_PROVIDERS = [
  StateCollectionResolve,
  LocationTypesCollectionResolve,
  DepartmentCollectionResolve,
  CurrencyCollectionResolve,
  VendorCollectionResolve,
  ProductCollectionResolve
];