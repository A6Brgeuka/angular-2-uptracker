import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ModelService } from '../../overrides/model.service';
import { Subscribers } from '../../decorators/subscribers.decorator';
import { StreetViewResource } from '../../core/resources/index';

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class StreetViewService extends ModelService{  
  constructor(
    public injector: Injector,
    public streetViewResource: StreetViewResource
  ) {
    super(injector, streetViewResource);
  }

  getLocationStreetView(data){
    return this.resource.getStreetView(data).$observable.do(
        (res: any) => {
          // let account = this.userService.selfData.account;
          // account.users = res.data.users;
          // this.updateSelfData(account);
        },
        (err: any) => {
        }
    );
  }
}