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
  currencyCollection: any;
  
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
    let data: any = {
      account_id: this.userService.selfData.account_id
    };
    let locationsLoaded = this.userService.selfData.account.locations ? this.userService.selfData.account.locations.length : false;
    if (!locationsLoaded) {
      return this.resource.getLocations(data).$observable.do((res: any) => {
        let account = this.userService.selfData.account;
        account.locations = res.data.locations;
        this.updateSelfData(account);
      });
    }
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
    let data: any = {
      account_id: this.userService.selfData.account_id
    };
    let usersLoaded = this.userService.selfData.account.users ? this.userService.selfData.account.users[0].name : false;
    if (!usersLoaded) {
      return this.resource.getUsers(data).$observable.do((res: any) => {
        let account = this.userService.selfData.account;
        account.users = res.data.users;
        this.updateSelfData(account);
      });
    }
  }

  addUser(data){
    return this.resource.addUser(data).$observable.do((res: any) => {
      // this.updateSelfData(res.data.account);
    });
  }

  putAccounting(data){
    return this.resource.putAccounting(data).$observable.do((res: any) => {
      // this.updateSelfData(res.data.account);
    });
  }

  getCurrencies(){
    if (!this.currencyCollection) {
      return this.resource.getCurrencies().$observable.do((res: any) => {
        this.currencyCollection = res.data;
      });
    }
  }
}