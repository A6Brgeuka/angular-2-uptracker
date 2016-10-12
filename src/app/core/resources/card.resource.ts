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
export class CardResource extends CustomResourceCRUD {
  @ResourceAction({
    method: RequestMethod.Post,
    path: '/register/payment'
  })
  addCard: ResourceMethod<any, any>;
}