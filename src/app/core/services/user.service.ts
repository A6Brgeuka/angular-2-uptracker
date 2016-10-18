import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { LocalStorage } from 'angular2-local-storage/local_storage';
import { CookieService } from 'angular2-cookie/services';
import { ModelService } from '../../overrides/model.service';
import { Subscribers } from '../../decorators/subscribers.decorator';
import { SpinnerService } from './spinner.service';
import { UserResource } from "../../core/resources/index";

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null
})
export class UserService extends ModelService {
  selfData: any;
  selfData$: Observable<any>;
  updateSelfData$: Subject<any> = new Subject<any>();
  
  //url for auth guard to redirect
  redirectUrl: string = null;
  
  constructor(
    public injector: Injector,
    public userResource: UserResource,
    public localStorage: LocalStorage,
    public cookieService: CookieService,
    public router: Router,
    public spinnerService: SpinnerService
  ) {
    super(injector, userResource);
    
    this.onInit();
  }
  
  onInit() {
    this.selfDataActions();
  }
  
  addSubscribers(){
    this.entity$.subscribe((res) => {
      this.updateSelfData$.next(res);
    });
  }

  selfDataActions() {
    this.selfData$ = Observable.merge(
      this.updateSelfData$
    )
    .filter((res: any) => {
      let user_id = res ? res.id || null : null;
      let condition = !this.cookieService.get('uptracker_selfId') || user_id == this.cookieService.get('uptracker_selfId');
      return condition;
    })
    .publishReplay(1).refCount();
    this.selfData$.subscribe((res: any) => {
      //Set token
      if (res['token'] && !res['signup']) {
        this.cookieService.put('uptracker_token', res['token']);
        this.cookieService.put('uptracker_selfId', res['id']);
      }
      this.selfData = res;
      console.log(`${this.constructor.name} Update SELF DATA`, res);
    });
  }

  isGuest(): boolean {
    return !this.cookieService.get('uptracker_token') || !this.cookieService.get('uptracker_selfId');
  }

  logout(redirectUrl = '/') {
    let data = {
      user_id: this.cookieService.get('uptracker_selfId')
    };
    return this.resource.logout(data).$observable
        .do((res) => {
          UserService.logout(this.cookieService, this.router, redirectUrl);
          this.updateSelfData({});
        });
  }
  static logout(cookieService, router, redirectUrl = '/') {
    cookieService.remove('uptracker_token');
    cookieService.remove('uptracker_selfId');
    router.navigate([redirectUrl]);
  }

  getToken(): any {
    if (this.isGuest()) {
      return null;
    }
    return this.cookieService.get('uptracker_token') || null;
  }

  getSelfId(): any {
    if (this.isGuest()) {
      return null;
    }
    return this.cookieService.get('uptracker_selfId') || null;
  }

  // for signup pages
  getSelfIdFromSelfData(): any {
    return this.selfData ? this.selfData.id || null : null;
  }

  getSelfData() {

    if (this.isGuest()){
      return Observable.of(null);
    }

    if (this.selfData && this.selfData != {}) {
      return Observable.of(this.selfData);
    }

    return this.loadSelfData();
  }

  loadSelfData(): Observable<any> {
    if (this.isGuest()) {
      return Observable.of(null);
    }

    let self = this;
    return this.loadEntity({id: this.getSelfId()}).do((res: any) => {
      let user = this.transformAccountInfo(res.data);
      self.updateSelfData(user);
    });
  }

  loadEntity(data = null){
    let entity = this.resource.getUserData(data).$observable;
    
    entity.subscribe((res: any) => { 
      let user = this.transformAccountInfo(res.data);
      this.updateEntity$.next(user);
    });
    
    return entity;
  }

  updateSelfData(data){
    this.updateSelfData$.next(data);
  }
  
  login(data) {
    return this.resource.login(data).$observable
      .do((res) => {
        this.afterLogin(res);
      });
  }
  
  afterLogin(data){
    data.data.user.user.token = data.data.user.token;
    let user = this.transformAccountInfo(data.data.user);

    this.updateSelfData(user);
    this.addToCollection$.next(user);
    this.updateEntity$.next(user);
  }

  signUp(data){
    let entity = this.resource.signup(data).$observable
        .publish().refCount();

    entity.subscribe(
        (res: any) => {
          // for SelfDataActions to avoid putting user_id in cookies (for isGuest functionality)
          res.data.user.signup = true;
          res.data.user.token = res.data.token;
          let user = this.transformAccountInfo(res.data);

          this.addToCollection$.next(user);
          this.updateEntity$.next(user);
          this.updateSelfData$.next(user);
        }
    );

    return entity;
  }

  forgotPasswordRequest(data) {
    return this.resource.forgotPasswordRequest(data).$observable;
  }

  forgotPasswordTokenValidation(token) {
    let data = {
      token: token
    };
    return this.resource.forgotPasswordTokenValidation(data).$observable;
  }

  updatePassword(data) {
    return this.resource.updatePassword(data).$observable;
  }

  verification(token) {
    let data = {
      token: token
    };
    return this.resource.verification(data).$observable
      .do((res)=> {
        let user = this.transformAccountInfo(res.data);
        this.updateSelfData(user);
      });
  }

  resendVerification() {
    let data = {
      user_id: this.getSelfId()
    };
    return this.resource.resendVerification(data).$observable;
  }
  
  emailVerified(){
    // version without observables
    let emailVerified = this.selfData ? this.selfData.email_verified || false : false;
    return emailVerified;

    // version with observable
    // TODO: remove after testing auth guard when app is ready
    // this.selfData$
    //     .map((res) => {
    //       return res.email_verified;
    //     })
    //     .delay(500)
    //     .subscribe((res: any) => {
    //       return res;
    //     });
  }

  transformAccountInfo(data){
    data.user.account = data.account || null;
    return data.user;
  }

  currentSignupStep(){
    if (!this.getSelfIdFromSelfData()) {
      return 1;
    }

    let user = this.selfData;
    if (user.email_verified) {
      return null;
    }
    if (!user.account_id) {
      return 2;
    }
    if (user.account) {
      let payment_token = user.account.payment_token || null;
      let trial_code = user.account.trial_code || null;
      if (!payment_token && !trial_code) {
        return 3;
      }
    }

    // if all steps are passed then user didn't verify email
    return 4;
  }
}