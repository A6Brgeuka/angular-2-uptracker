import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// import { LocalStorage } from 'angular2-local-storage/local_storage';
// import { CookieService } from 'angular2-cookie/services';
import { ModelService } from '../../overrides/model.service';
import { Subscribers } from '../../decorators/subscribers.decorator';
import { SpinnerService } from './spinner.service';
import { UserResource } from '../../core/resources/index';
import { SessionService } from './session.service';
import { Restangular } from 'ng2-restangular';

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null
})
export class UserService extends ModelService {
  selfData: any;
  selfData$: Observable<any>;
  updateSelfData$: Subject<any> = new Subject<any>();
  
  redirectUrl: string = null; //url for auth guard to redirect
  session: any = {};

  constructor(
    public injector: Injector,
    public userResource: UserResource,
    // public localStorage: LocalStorage,
    // public cookieService: CookieService,
    public sessionService: SessionService,
    public router: Router,
    public spinnerService: SpinnerService,
    private restangular: Restangular
  ) {
    super(injector, userResource);
    
    this.onInit();
  }
  
  onInit() {
    // this.session = {
    //   id: this.localStorage.get('uptracker_selfId') || this.cookieService.get('uptracker_selfId'),
    //   token: this.localStorage.get('uptracker_token') || this.cookieService.get('uptracker_token'),
    // };
    this.selfDataActions();
  }

  getSessionId(){
    // return this.session.id ? this.session.id : this.localStorage.get('uptracker_selfId') || this.cookieService.get('uptracker_selfId');
    return this.sessionService.get('uptracker_selfId');
  }

  getSessionToken(){
    // return this.session.token ? this.session.token : this.localStorage.get('uptracker_token') || this.cookieService.get('uptracker_token');
    return this.sessionService.get('uptracker_token');
  }
  
  setSessionId(id) {
    // this.localStorage.set('uptracker_selfId', id);
    // this.cookieService.put('uptracker_selfId', id);
    this.sessionService.set('uptracker_selfId', id);
  }

  setSessionToken(token){
    // this.localStorage.set('uptracker_token', token);
    // this.cookieService.put('uptracker_token', token);
    this.sessionService.set('uptracker_token', token);
  }

  getSelfId(): any {
    if (this.isGuest()) {
      return null;
    }
    return this.getSessionId() || null;
  }

  // for signup pages
  getSelfIdFromSelfData(): any {
    return this.selfData ? this.selfData.id || null : null;
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
      // let condition = !this.cookieService.get('uptracker_selfId') || res.id == this.cookieService.get('uptracker_selfId');
      let condition = !this.getSessionId() || res.id == this.getSessionId();
      return condition;
    })
    .publishReplay(1).refCount();

    this.selfData$.subscribe((res: any) => { 
      //Set token
      if (res['token'] && !res['signup']) {
        this.setSessionId(res['id']);
        this.setSessionToken(res['token']);
      }
      this.selfData = res;
      console.log(`${this.constructor.name} Update SELF DATA`, res);
    });
  }

  isGuest(): boolean {
    return !this.getSessionId() || !this.getSessionToken();
  }

  logout(redirectUrl = '/') { 
    let data = {
      user_id: this.getSessionId()
    };
    return this.resource.logout(data).$observable
        .do((res) => {
          UserService.logout(this.sessionService, this.router, redirectUrl);
          this.updateSelfData({});
          // this.session = {};
        });
  }
  static logout(sessionService, router, redirectUrl = '/') {
    // localStorage.remove('uptracker_token');
    // localStorage.remove('uptracker_selfId');
    // cookieService.remove('uptracker_token');
    // cookieService.remove('uptracker_selfId');
    sessionService.remove('uptracker_token');
    sessionService.remove('uptracker_selfId');
    router.navigate([redirectUrl]);
  }

  loadSelfData(): Observable<any> {
    if (this.isGuest()) {
      return Observable.of(null);
    }

    if (this.selfData && this.selfData != {}) {
      return Observable.of(this.selfData);
    }

    return this.loadEntity({id: this.getSelfId()});
  }

  loadEntity(data = null){
    let entity = this.resource.getUserData(data).$observable;
    // let entity = this.restangular.one('users', data.id).get();
    
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
  }

  signUp(data){
    let entity = this.resource.signup(data).$observable
        .publish().refCount();

    entity.subscribe(
        (res: any) => {
          // for SelfDataActions to avoid putting user_id in cookies (for isGuest functionality)
          // res.data.user.signup = true;
          res.data.user.token = res.data.token;
          let user = this.transformAccountInfo(res.data);

          this.addToCollection$.next(user);
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
  
  updateSelfDataField(field, data){
    let user = this.selfData;
    user[field] = data;
    this.updateSelfData(user);
  }

  updateSelfDataAccountField(field, data){
    if (this.selfData.account){
      let account = this.selfData.account;
      account[field] = data;
      this.updateSelfDataField('account', account);
    }
  }
}