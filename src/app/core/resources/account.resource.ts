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
export class AccountResource extends CustomResourceCRUD {
  @ResourceAction({
    method: RequestMethod.Post,
    path: '/register/company'
  })
  createCompany: ResourceMethod<any, any>;
  
  @ResourceAction({
    method: RequestMethod.Get,
    path: '/accounts/{!account_id}/locations'
  })
  getLocations: ResourceMethod<any, any>;

  @ResourceAction({
    method: RequestMethod.Get,
    path: '/config/states'
  })
  getStates: ResourceMethod<any, any>;

  @ResourceAction({
    method: RequestMethod.Get,
    path: '/config/location_types'
  })
  getLocationTypes: ResourceMethod<any, any>;

  @ResourceAction({
    method: RequestMethod.Post,
    path: '/accounts/{!account_id}/locations'
  })
  addLocation: ResourceMethod<any, any>;

  @ResourceAction({
    method: RequestMethod.Get,
    path: '/accounts/{!account_id}/users'
  })
  getUsers: ResourceMethod<any, any>;

  @ResourceAction({
    method: RequestMethod.Post,
    path: '/accounts/{!account_id}/users'
  })
  addUser: ResourceMethod<any, any>;
}