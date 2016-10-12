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
      return !this.cookieService.get('uptracker_selfId') || res.id == this.cookieService.get('uptracker_selfId');
    })
    .publishReplay(1).refCount();
    this.selfData$.subscribe((res: any) => {
      //Set token
      if (res['token'] && !res['signup']) {
        this.cookieService.put('uptracker_token', res['token']);
        this.cookieService.put('uptracker_selfId', res['id']);
      }
      this.selfData = res;
      console.log(`${this.defaultOptions.childClassName} Update SELF DATA`, res);
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
          this.updateSelfData$.next({});
          UserService.logout(this.cookieService, this.router, redirectUrl);
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

  loadSelfData(): Observable<any> {
    if (this.isGuest()) {
      return Observable.of(null);
    }

    let self = this;
    return this.loadEntity({id: this.getSelfId()}).do((res: any) => {
      let user = this.transformAccountInfo(res.data);
      // TODO: figure out the problem with updateSelfData$ and updateEntity$ and uncomment
      // self.updateSelfData(user);
    });

    // TODO: remove after checking app resolver
    // return this.selfData$;
  }

  loadEntity(data = null){
    let entity = this.resource.getUserData(data).$observable;
    
    entity.subscribe((res: any) => {
      //res.data.user.account = res.data.account;
      let user = this.transformAccountInfo(res.data); 
      // TODO: figure out the problem with updateSelfData$ and updateEntity$ and uncomment
      // this.updateEntity$.next(user);
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
    // data.data.user.user.account = data.data.user.account;

    this.addToCollection$.next(user);
    this.updateEntity$.next(user);
    this.updateSelfData(user);
  }

  signUp(data){
    let entity = this.resource.signup(data).$observable
        .publish().refCount();

    entity.subscribe(
        (res: any) => {
          // for SelfDataActions to avoid putting user_id in cookies (for isGuest functionality)
          res.data.user.signup = true;
          res.data.user.token = res.data.token;

          this.addToCollection$.next(res.data.user);
          this.updateEntity$.next(res.data.user);
          this.updateSelfData$.next(res.data.user);
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
    return this.resource.verification(data).$observable;
    // .do((res)=> {
    //   this.updateSelfData$.next(res);
    // });
  }

  transformAccountInfo(data){
    data.user.account = data.account || null;
    return data.user;
  }
}