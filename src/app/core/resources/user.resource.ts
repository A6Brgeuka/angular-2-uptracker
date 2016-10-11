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
export class UserResource extends CustomResourceCRUD {
  @ResourceAction({
    method: RequestMethod.Post,
    path: '/login'
  })
  login: ResourceMethod<any, any>;
  
  @ResourceAction({
    method: RequestMethod.Post,
    path: '/register/user'
  })
  signup: ResourceMethod<any, any>;

  @ResourceAction({
    method: RequestMethod.Post,
    path: '/forgot'
  })
  forgotPasswordRequest: ResourceMethod<any, any>;

  @ResourceAction({
    method: RequestMethod.Get,
    path: '/forgot/{!token}'
  })
  forgotPasswordTokenValidation: ResourceMethod<any, any>;
  
  @ResourceAction({
    method: RequestMethod.Post,
    path: '/passwordreset'
  })
  updatePassword: ResourceMethod<any, any>;
  
  @ResourceAction({
    method: RequestMethod.Post,
    path: '/verification'
  })
  verification: ResourceMethod<any, any>;
}