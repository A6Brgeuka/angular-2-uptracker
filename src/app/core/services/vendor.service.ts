import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

import { ModelService } from '../../overrides/model.service';
import { UserService } from './user.service';
import { Subscribers } from '../../decorators/subscribers.decorator';
import { VendorResource } from '../../core/resources/index';

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class VendorService extends ModelService{
  selfData: any;
  selfData$: Observable<any>;
  updateSelfData$: Subject<any> = new Subject<any>();


  constructor(
      public injector: Injector,
      public vendorResource: VendorResource,
      public userService: UserService
  ) {
    super(injector, vendorResource);

    this.onInit();
  }

  onInit(){
    this.selfData$ = Observable.merge(
        this.updateSelfData$
    );
    this.selfData$.subscribe((res) => {
      this.selfData = res;
      console.log(`${this.constructor.name} Update SELF DATA`, res);

      //update user after update account
      this.userService.updateSelfDataField('account', this.selfData);
    });
  }

  addSubscribers(){
    this.entity$.subscribe((res) => {
      //update user after update account
      // this.userService.updateSelfDataField('account', res);

      this.updateSelfData(res);
    });
  }

  updateSelfData(data){
    this.updateSelfData$.next(data);
  }

  getVendors(){
    let vendorsLoaded = this.selfData ? this.selfData.length : false;
    if (!vendorsLoaded) {
      return this.resource.getVendors().$observable
          .map((res: any) => {
            return res.data.vendors;
          })
          .do((res: any) => {
            this.updateCollection$.next(res);
          });
    }
  }

  getVendor(id){
    let data = {
      id: id
    };
    return this.resource.getVendor(data).$observable;
  }

  searchVendor(query){
    let data = {
      query: query
    };
    return this.resource.searchVendors(data).$observable;
  }
}