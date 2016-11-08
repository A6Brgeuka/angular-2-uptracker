import { Injectable } from '@angular/core';
import { RequestMethod } from '@angular/http';

import { ResourceParams, ResourceAction, ResourceMethod } from 'ng2-resource-rest';
import { CustomResourceCRUD } from '../../overrides/custom-resource-crud';
import { DefaultOptions } from '../../decorators/default-options.decorator';

@Injectable()
@ResourceParams({
  url: ''
})
@DefaultOptions({
  expand: {
    default: []
  }
})
export class VendorResource extends CustomResourceCRUD {
  @ResourceAction({
    method: RequestMethod.Get,
    path: '/vendors'
  })
  getVendors: ResourceMethod<any, any>;

  @ResourceAction({
    method: RequestMethod.Get,
    path: '/vendors/{!id}'
  })
  getVendor: ResourceMethod<any, any>;

  @ResourceAction({
    method: RequestMethod.Get,
    path: '/search/vendors?query={!query}'
  })
  searchVendors: ResourceMethod<any, any>;
}