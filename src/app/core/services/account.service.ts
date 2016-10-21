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
  
  locationTypeCollection: any;
  stateCollection: any;
  departmentCollection: any;
  userCollection: any;
  
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

  createCompany(data){
    let entity = this.resource.createCompany(data).$observable
        .publish().refCount();

    entity.subscribe(
        (res: any) => {
          this.addToCollection$.next(res.data.account);
          this.updateEntity$.next(res.data.account);
          this.updateSelfData(res.data.account);
        }
    );

    return entity;
  }

  getLocations(){
    let data: any = {};
    data.account_id = this.userService.selfData.account_id;
    return this.resource.getLocations(data).$observable;
  }

  getStates(){
    if (!this.stateCollection) {
      return this.resource.getStates().$observable.do((res: any) => {
        this.stateCollection = res.data;
      });
    }
  }

  getLocationTypes(){
    if (!this.locationTypeCollection) {
      return this.resource.getLocationTypes().$observable.do((res: any) => {
        this.locationTypeCollection = res.data;
      });
    }
  }

  addLocation(data){
    return this.resource.addLocation(data).$observable.do((res: any) => {
      this.updateSelfData(res.data.account);
    });
  }

  getDepartments(){
    if (!this.departmentCollection) {
      return this.resource.getDepartments().$observable.do((res: any) => {
        this.departmentCollection = res.data;
      });
    }
  }

  getUsers(){
    let data: any = {};
    data.account_id = this.userService.selfData.account_id;
    if (!this.userCollection) {
      return this.resource.getUsers(data).$observable.do((res: any) => {
        this.userCollection = res.data.users;
        this.userService.updateSelfDataAccountField('users', res.data.users);
      });
    }
  }

  addUser(data){
    return this.resource.addUser(data).$observable.do((res: any) => {
      // this.updateSelfData(res.data.account);
    });
  }
}