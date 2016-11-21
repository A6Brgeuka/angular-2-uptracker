import { Injectable, Injector, Inject } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';
import { Restangular } from 'ng2-restangular';

import { ModelService } from '../../overrides/model.service';
import { UserService } from './user.service';
import { Subscribers } from '../../decorators/subscribers.decorator';
import { AppConfig, APP_CONFIG } from '../../app.config';
import {isUndefined} from "util";

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
  roleCollection$ = Observable.empty();

  onboardAccounting: any = {
    total: [],
    budget_distribution: [],
    currency: 'USD'
  };;

  public appConfig: AppConfig;
  
  constructor(
    public injector: Injector,
    public userService: UserService,
    public restangular: Restangular
  ) {
    super(restangular);
    this.appConfig = injector.get(APP_CONFIG);
  
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
      this.updateSelfData(res);
    });
  }

  updateSelfData(data){
    this.updateSelfData$.next(data);
  }

  createCompany(data){
    return this.restangular.all('register').all('company').post(data)
        .do(
          (res: any) => {
            this.addToCollection$.next(res.data.account);
            this.updateEntity$.next(res.data.account);
            this.updateSelfData(res.data.account);
          }
        );
  }

  getLocations(){
    let account = this.userService.selfData.account;
    let locationsLoaded = account ?  !isUndefined(account.locations) ? true : false : false;
    if (!locationsLoaded) {
      // TODO: remove after testing restangular
      // let data: any = {
      //   account_id: this.userService.selfData.account_id
      // };
      // return this.resource.getLocations(data).$observable /accounts/{!account_id}/locations
      return this.restangular.one('accounts', this.userService.selfData.account_id).all('locations').customGET('')
          .do((res: any) => {
            account.locations = res.data.locations;
            this.updateSelfData(account);
          });
    } else {
      return this.userService.selfData$.map(res => res.account.locations);
    }
  }

  getStates(){
    return this.stateCollection$.isEmpty().switchMap((isEmpty) => {
      if(isEmpty) {
        this.stateCollection$ = this.restangular.all('config').all('states').customGET('');
        // TODO: remove after testing restangular
        // this.stateCollection$ = this.resource.getStates().$observable.publishReplay(1).refCount();
      }
      return this.stateCollection$;
    });
  }

  getLocationTypes(){
    return this.locationTypeCollection$.isEmpty().switchMap((isEmpty) => {
      if(isEmpty) {
        this.locationTypeCollection$ = this.restangular.all('config').all('location_types').customGET('');
        // TODO: remove after testing restangular
        // this.locationTypeCollection$ = this.resource.getLocationTypes().$observable.publishReplay(1).refCount();
      }
      return this.locationTypeCollection$;
    });
  }

  getLocationStreetView(params: any){
    params.key = this.appConfig.streetView.apiKey;
    params.size = '520x293';
    let imageUrl = this.appConfig.streetView.endpoint+'?location='+params.location+'&size='+params.size+'&key='+params.key;
    return imageUrl.replace(/\s/g,'%20');
  }

  addLocation(data: any){
    // TODO: remove after testing restangular
    // return this.resource.addLocation(data).$observable
    return this.restangular.one('accounts', data.account_id).all('locations').post(data)
        .do((res: any) => {
          let account = this.userService.selfData.account;
          account.locations = res.data.account.locations;
          this.updateSelfData(account);
        });
  }

  getDepartments(){
    return this.departmentCollection$.isEmpty().switchMap((isEmpty) => {
      if(isEmpty) {
        this.departmentCollection$ = this.restangular.all('config').all('departments').customGET('');
        // TODO: remove after testing restangular
        // this.departmentCollection$ = this.resource.getDepartments().$observable.publishReplay(1).refCount();
      }
      return this.departmentCollection$;
    });
  }

  getUsers(){
    let usersLoaded = this.userService.selfData.account.users ? this.userService.selfData.account.users[0].name : false;
    if (!usersLoaded) {
      // TODO: remove after testing restangular
      // let data: any = {
      //   account_id: this.userService.selfData.account_id
      // };
      // let users$ = this.resource.getUsers(data).$observable.publishReplay(1).refCount();
      return this.restangular.one('accounts', this.userService.selfData.account_id).all('users').customGET('')
          .map((res: any) => {
            return res.data.users;
          })
          .do((res: any) => {
            let account = this.userService.selfData.account;
            account.users = res;
            this.updateSelfData(account);
          });
    } else {
      return this.userService.selfData$.map(res => res.account.users);
    }
  }

  addUser(data){
    // TODO: remove after testing restangular
    // return this.resource.addUser(data).$observable
    return this.restangular.all('users').post(data)
        .do((res: any) => {
          let account = this.userService.selfData.account;
          // if new user push him to account users array, else update user in array
          if (_.some(account.users, {'id': res.data.user.id})){
            let userArr = _.map(account.users, function(user){
              if (user['id'] == res.data.user.id) {
                return _.cloneDeep(res.data.user);
              } else {
                return user;
              }
            });
            account.users = userArr;
          } else {
            account.users.push(res.data.user);
          }

          // check if changed user self data
          if (res.data.user.id == this.userService.getSelfId()){
            let user = res.data.user;
            user.account = account;
            this.userService.updateSelfData(user);
          } else {
            this.updateSelfData(account);
          }
        });
  }

  putAccounting(data: any){
    // TODO: remove after testing restangular
    // return this.resource.putAccounting(data).$observable
    return this.restangular.one('accounts', data.account_id).customPUT(data)
        .do((res: any) => {
          this.updateSelfData(res.data.account.account);
        });
  }

  getCurrencies(){
    return this.currencyCollection$.isEmpty().switchMap((isEmpty) => { 
      if (isEmpty) {
        // TODO: remove after testing restangular
        // this.currencyCollection$ = this.resource.getCurrencies().$observable
        this.currencyCollection$ = this.restangular.all('config').all('currency').customGET('')
            .map((res: any) => {
              let currencyArr = _.sortBy(res.data, 'priority');
              return currencyArr;
            });
      }
      return this.currencyCollection$;
    });
  }

  getRoles(){
    // TODO: remove after testing
    // let data: any = {
    //   account_id: this.userService.selfData.account_id
    // };
    // return this.roleCollection$.isEmpty().switchMap((isEmpty) => {
    //   if(isEmpty) {
    //     this.roleCollection$ = this.restangular.one('accounts', this.userService.selfData.account_id).all('permissions').customGET('')
    //     // this.roleCollection$ = this.resource.getRoles(data).$observable
    //         .do((res: any) => { debugger;
    //           let account = this.userService.selfData.account;
    //           account.roles = res.data.roles;
    //           this.updateSelfData(account);
    //         })
    //         .publishReplay(1).refCount();
    //   }
    //   return this.roleCollection$;
    // });


    let rolesLoaded = this.userService.selfData.account.roles ? this.userService.selfData.account.roles[0].role : false;
    if (!rolesLoaded) {
      // TODO: remove after testing restangular
      // let roles$ = this.resource.getRoles(data).$observable.publishReplay(1).refCount();
      return this.restangular.one('accounts', this.userService.selfData.account_id).all('permissions').customGET('')
          .map((res: any) => {
            return res.data.roles;
          })
          .do((res: any) => {
            let account = this.userService.selfData.account;
            account.roles = res;
            this.updateSelfData(account);
          });
    } else {
      return this.userService.selfData$.map(res => res.account.roles);
    }
  }
  
  addRole(data){
    // TODO: remove after testing restangular
    // return this.resource.addRole(data).$observable accounts/{!account_id}/roles
    return this.restangular.one('accounts', data.account_id).all('roles').post(data)
        .do((res: any) => {
          let account = this.userService.selfData.account;
          account.roles = res.data.roles;
          this.updateSelfData(account);
        });
  }
}