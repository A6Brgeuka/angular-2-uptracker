import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { LocalStorage } from 'angular2-local-storage/local_storage';
import { CookieService } from 'angular2-cookie/services';
// import { HttpClient } from './http.service';
// import { DefaultOptions } from '../../decorators/default-options.decorator';
import { ToasterService } from './toaster.service';
import { APP_CONFIG } from '../../app.config';
import { ModelService } from '../../overrides/model.service';
import { Subscribers } from '../../decorators/subscribers.decorator';
import { SpinnerService } from './spinner.service';
import { UserResource } from "../../core/resources/index";

@Injectable()
// @DefaultOptions({
//   modelEndpoint: '',
//   expand: {
//     default: []
//   }
// })
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
    // public http: HttpClient,
    public userResource: UserResource,
    public toasterService: ToasterService,
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
    .filter(res => {
      return !this.cookieService.get('uptracker_selfId') || res.id == this.cookieService.get('uptracker_selfId');
    })
    .publishReplay(1).refCount();
    this.selfData$.subscribe(res => {
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
    // let data = {
    //   user_id: this.cookieService.get('uptracker_selfId')
    // };
    // let body = JSON.stringify(data);
    // let api = this.apiEndpoint + 'logout';
    // return this.http.post(api, body)
    //     .map(this.extractData.bind(this))
    //     .catch(this.handleError.bind(this))
    //     .do((res) => {
    //       this.cookieService.remove('uptracker_token');
    //       this.cookieService.remove('uptracker_selfId');
    //       this.updateSelfData$.next({});
    //       this.router.navigate([redirectUrl]);
    //     });

    UserService.logout(this.cookieService, this.router);
  }
  static logout(cookieService, router) {
    cookieService.remove('token');
    cookieService.remove('selfId');
    router.navigate(['/']);
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

    this.loadEntity({id: this.getSelfId()});

    return this.selfData$;
  }

  loadEntity(data = null){
    // TODO:
    // finish function when endpoint will be known
    // if (!data) {
    //   data = {
    //     token: this.getToken()
    //   };
    // }
    
    // let api = this.apiEndpoint + 'getuser';
    // let entity = this.http.get(api, data)
    //     .map(this.extractData.bind(this))
    //     .catch(this.handleError.bind(this))
    //     .publishReplay(1).refCount();
    //
    // entity.subscribe((res) => {
    //   this.updateSelfData$.next(res);
    // });
    //
    // return entity;
  }

  updateSelfData(data){
    this.updateSelfData$.next(data);
  }
  
  login(data) {
    return this.resource.login(data).$observable
        .do((res)=> {
          this.afterLogin(res);
        });
  }
  
  afterLogin(data){
    data.data.user.user.token = data.data.user.token;
    data.data.user.user.account = data.data.user.account; 
    
    this.updateSelfData$.next(data.data.user.user);
    this.addToCollection$.next(data.data.user.user);
    this.updateEntity$.next(data.data.user.user);
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
    let api = this.apiEndpoint + 'forgot/' + token;
    return this.resource.forgotPasswordTokenValidation(token).$observable;
  }

  updatePassword(data) {
    let api = this.apiEndpoint + 'passwordreset';
    return this.resource.updatePassword(data).$observable;
  }

  verification(data) {
    let body = JSON.stringify(data);

    return this.resource.verification(data).$observable
    .do((res)=> {
      this.updateSelfData$.next(res);
    });
  }

  // handleError(error: any) {
  //   if (error.status == 401 || error.status == 404) {
  //     this.logout();
  //   }
  //
  //   this.spinnerService.hide();
  //
  //   let body = JSON.parse(error._body);
  //   let errMsg = body.length ? body[0]['error_message'] : body['error_message'];
  //
  //   this.toasterService.pop('error', errMsg);
  //
  //   return Observable.throw(errMsg);
  // }
}