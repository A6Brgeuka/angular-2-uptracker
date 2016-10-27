import { Injectable } from '@angular/core';
import { RequestMethod } from '@angular/http';

import { ResourceParams, ResourceAction, ResourceMethod } from 'ng2-resource-rest';
import { StreetViewResourceCRUD } from '../../overrides/street-view-resource-crud';
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
export class StreetViewResource extends StreetViewResourceCRUD {
  @ResourceAction({
    method: RequestMethod.Get,
    path: ''
  })
  getStreetView: ResourceMethod<any, any>;
 
}