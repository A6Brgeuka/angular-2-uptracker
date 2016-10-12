import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ModelService } from '../../overrides/model.service';
import { UserService } from './user.service';
import { Subscribers } from '../../decorators/subscribers.decorator';
import { AccountResource } from '../../core/resources/index';

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class AccountService extends ModelService{  
  selfData: any;
  selfData$: Observable<any>;
  updateSelfData$: Subject<any> = new Subject<any>();
  
  constructor(
    public injector: Injector,
    public accountResource: AccountResource,
    public userService: UserService
  ) {
    super(injector, accountResource);
  
    this.onInit();
  }
  
  onInit(){
    this.selfData$ = Observable.merge(
        this.updateSelfData$
    );
    this.selfData$.subscribe(res => {
      this.selfData = res;
      console.log(`${this.constructor.name} Update SELF DATA`, res);
    });
  }
  
  addSubscribers(){
    this.entity$.subscribe((res) => {
      //update user after update account
      // this.userService.loadSelfData();

      this.updateSelfData$.next(res);
    });
  }

  createCompany(data){
    let entity = this.resource.createCompany(data).$observable
        .publish().refCount();

    entity.subscribe(
        (res: any) => {
          this.addToCollection$.next(res.data.account);
          this.updateEntity$.next(res.data.account);
          this.updateSelfData$.next(res.data.account);
        }
    );

    return entity;
  }

  getLocations(){
    let data: any = {};
    // TODO:
    // get account_id when api endpoint for user info is ready
    // this.userService.loadEntity().subscribe((res) => {
    //   account_id = '57e9c7cc71d08f551dca992a';
    // });
    data.account_id = "57e9c7cc71d08f551dca992a";
    return this.resource.getLocations(data).$observable;
  }

  getStates(){
    return this.resource.getStates().$observable;
  }

  getLocationTypes(){
    return this.resource.getLocationTypes().$observable;
  }
  
}