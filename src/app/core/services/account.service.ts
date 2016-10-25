import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as lodashSome from 'lodash/some';
import * as lodashMap from 'lodash/map';

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
  
  locationTypeCollection$ = Observable.empty();
  stateCollection$ = Observable.empty();
  currencyCollection$ = Observable.empty();
  departmentCollection$ = Observable.empty();
  
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
    return this.stateCollection$.isEmpty().switchMap((isEmpty) => {
      if(isEmpty) {
        this.stateCollection$ = this.resource.getStates().$observable.publishReplay(1).refCount();
      }
      return this.stateCollection$;
    });
  }

  getLocationTypes(){
    return this.locationTypeCollection$.isEmpty().switchMap((isEmpty) => {
      if(isEmpty) {
        this.locationTypeCollection$ = this.resource.getLocationTypes().$observable.publishReplay(1).refCount();
      }
      return this.locationTypeCollection$;
    });
  }

  addLocation(data){
    return this.resource.addLocation(data).$observable.do((res: any) => {
      this.updateSelfData(res.data.account);
    });
  }

  getDepartments(){
    return this.departmentCollection$.isEmpty().switchMap((isEmpty) => {
      if(isEmpty) {
        this.departmentCollection$ = this.resource.getDepartments().$observable.publishReplay(1).refCount();
      }
      return this.departmentCollection$;
    });
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
      let account = this.userService.selfData.account;
      if (lodashSome(account.users, {'id': res.data.user.id})){
        let userArr = lodashMap(account.users, function(user){
          if (user['id'] == res.data.user.id) {
            return res.data.user;
          } else {
            return user;
          }
        });
        account.users = userArr;
      } else {
        account.users.push(res.data.user);
      }
      this.updateSelfData(account);
    });
  }

  putAccounting(data){
    return this.resource.putAccounting(data).$observable.do((res: any) => {
      // this.updateSelfData(res.data.account);
    });
  }

  getCurrencies(){
    return this.currencyCollection$.isEmpty().switchMap((isEmpty) => {
      if(isEmpty) {
        this.currencyCollection$ = this.resource.getCurrencies().$observable.publishReplay(1).refCount();
      }
      return this.currencyCollection$;
    });
  }
}