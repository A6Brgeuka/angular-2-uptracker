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
    method: RequestMethod.Post,
    path: '/register/user'
  })
  signup: ResourceMethod<any, any>;
}