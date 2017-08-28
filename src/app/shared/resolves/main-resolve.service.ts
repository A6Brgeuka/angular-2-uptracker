import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { AccountService, VendorService, ProductService } from '../../core/services/index';
import { LocationService } from "../../core/services/location.service";
import { InventoryService } from '../../core/services/inventory.service';
import { PastOrderService } from '../../core/services/pastOrder.service';

@Injectable()
export class StateCollectionResolve implements Resolve<any> {
  constructor(
      public accountService: AccountService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.getStates().take(1);
  }
}

@Injectable()
export class LocationTypesCollectionResolve implements Resolve<any> {
  constructor(
      public locationService: LocationService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.locationService.getLocationTypes().take(1);
  }
}

@Injectable()
export class DepartmentCollectionResolve implements Resolve<any> {
  constructor(
      public accountService: AccountService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.getDepartments().take(1);
  }
}

@Injectable()
export class ProductAccountingCollectionResolve implements Resolve<any> {
  constructor(
      public accountService: AccountService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.getProductAccounting().take(1);
  }
}

@Injectable()
export class ProductCategoriesCollectionResolve implements Resolve<any> {
  constructor(
      public accountService: AccountService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.getProductCategories().take(1);
  }
}

@Injectable()
export class CurrencyCollectionResolve implements Resolve<any> {
  constructor(
      public accountService: AccountService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.getCurrencies().take(1);
  }
}

@Injectable()
export class VendorCollectionResolve implements Resolve<any> {
  constructor(
      public vendorService: VendorService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.vendorService.getVendors().take(1);
  }
}

@Injectable()
export class ProductCollectionResolve implements Resolve<any> {
  constructor(
      public productService: ProductService,
      public accountService: AccountService
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.productService.getProducts().take(1);
  }
}

@Injectable()
export class InventoryPackageListResolve implements Resolve<any> {
  constructor(
    public inventoryService: InventoryService,
  ) {
  
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.inventoryService.getPackagesLists().take(1);
  }
}

@Injectable()
export class StatusListResolve implements Resolve<any> {
  constructor(
    public pastOrderService: PastOrderService,
    
  ) {
  
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.pastOrderService.getStatusList().take(1);
  }
}

//@Injectable()
//export class InventoryResolve implements Resolve<any> {
//  constructor(
//    public inventoryService: InventoryService,
//  ) {
//
//  }
//  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//    return this.inventoryService.getInventories().take(1);
//  }
//}

// an array of services to resolve routes with data
export const MAIN_RESOLVER_PROVIDERS = [
  StateCollectionResolve,
  LocationTypesCollectionResolve,
  DepartmentCollectionResolve,
  CurrencyCollectionResolve,
  VendorCollectionResolve,
  ProductCollectionResolve,
  ProductAccountingCollectionResolve,
  ProductCategoriesCollectionResolve,
  InventoryPackageListResolve,
  StatusListResolve
];