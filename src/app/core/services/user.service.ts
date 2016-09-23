import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage } from 'angular2-local-storage/local_storage';
import { CookieService } from 'angular2-cookie/services';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { HttpClient } from './http.service';
import { ToasterService } from './toaster.service';
import { APP_CONFIG } from '../../app.config';
import { ModelService } from '../../overrides/model.service';
import { DefaultOptions } from '../../decorators/default-options.decorator';
import { Subscribers } from '../../decorators/subscribers.decorator';

@Injectable()
@DefaultOptions({
  modelEndpoint: '',
  expand: {
    default: []
  }
})
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null
})
export class UserService extends ModelService {
  
  // static STATUS_BLOCKED = 0;
  // static STATUS_ACTIVE = 1;
  //
  // static ROLE_USER = 3;
  // static ROLE_OWNER = 2;
  // static ROLE_ADMIN = 1;
  //
  // static TYPE_AUTHENTICATION_DEFAULT = 1;
  // static TYPE_AUTHENTICATION_SMS = 2;

  selfData: any;
  selfData$: Observable<any>;
  updateSelfData$: Subject<any> = new Subject<any>();

  // apiEndpoint: string = 'http://uptracker-api.herokuapp.com/api/v1';
  // apiEndpoint: string = 'http://private-anon-ce8323ff87-uptracker.apiary-mock.com/api/v1';
  
  constructor(
    public injector: Injector,
    public http: HttpClient,
    public toasterService: ToasterService,
    public localStorage: LocalStorage,
    public cookieService: CookieService,
    public router: Router
  ) {
    super(injector);
    
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
      // return !this.localStorage.get('selfId') || res.id == this.localStorage.get('selfId');
      return !this.cookieService.get('uptracker_selfId') || res.id == this.cookieService.get('uptracker_selfId');
    })
    .publishReplay(1).refCount();
    this.selfData$.subscribe(res => {
      //Set token
      if (res['token']) {
        this.cookieService.put('uptracker_token', res['token']);
        this.cookieService.put('uptracker_selfId', res['id']);
      }
      this.selfData = res;
      console.log(`${this.defaultOptions.childClassName} Update SELF DATA`, res);
    });
  }

  isGuest(): boolean {
    return !this.cookieService.get('uptracker_token');
  }

  logout() {
    this.cookieService.remove('uptracker_token');
    this.cookieService.remove('uptracker_selfId');
    this.router.navigate(['/']);
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
    return this.cookieService.get('uptracker_selfId');
  }

  // loadSelfData(): Observable<any> {
  //   if (this.isGuest()) {
  //     return Observable.of(null);
  //   }
  //
  //   this.loadEntity({id: this.getSelfId()});
  //
  //   return this.selfData$;
  // }

  // updateSelfData(data){
  //   this.updateSelfData$.next(data);
  // }
  
  login(data) {
    let body = JSON.stringify(data);
    let api = this.apiEndpoint + 'login';
    return this.http.post(api, body, {
      // search: this.getSearchParams('login')
    })
      .map(this.extractData.bind(this))
      .catch(this.handleError.bind(this))
      .do((res) => {
        this.afterLogin(res);
      });
  }
  
  afterLogin(data){
    data.data.user.user.token = data.data.user.token;
    console.log(data.data.user.user);
    // this.localStorage.set('uptracker_token', '');
    // this.localStorage.set('uptracker_selfId', '');
    // this.cookieService.put('uptracker_token', '');
    // this.cookieService.put('uptracker_selfId', '');
    this.updateSelfData$.next(data.data.user.user);
  }

  // signUp(data){
  //   let entity = super.create(data);
  //
  //   entity.subscribe(res => {
  //     this.updateSelfData$.next(res);
  //   });
  //
  //   return entity;
  // }
  //
  // updatePasswordRequest(data?) {
  //   return this.http.post(`${this.apiEndpoint}/update-password-request`, data)
  //   .map(this.extractData.bind(this))
  //   .catch(this.handleError.bind(this))
  // }
  //
  // updatePassword(data) {
  //   return this.http.post(`${this.apiEndpoint}/update-password`, data)
  //   .map(this.extractData.bind(this))
  //   .catch(this.handleError.bind(this))
  //   .do((res)=> {
  //     this.updateSelfData$.next(res);
  //   });
  // }
  //
  // verification(data) {
  //   let body = JSON.stringify(data);
  //
  //   return this.http.post(`${this.apiEndpoint}/verification`, body, {
  //     search: this.getSearchParams('login')
  //   })
  //   .map(this.extractData.bind(this))
  //   .catch(this.handleError.bind(this))
  //   .do((res)=> {
  //     this.updateSelfData$.next(res);
  //   });
  // }
  //
  // smsRequest(data) {
  //   let body = JSON.stringify(data);
  //
  //   return this.http.post(`${this.apiEndpoint}/sms-request`, body)
  //   .map(this.extractData.bind(this))
  //   .catch(this.handleError.bind(this))
  //   .do((res)=> {
  //     this.toasterService.pop('success', 'SMS sent to your phone');
  //     this.updateSelfData$.next(res);
  //   });
  // }
  //
  // smsLogin(data) {
  //   let body = JSON.stringify(Object.assign({}, data, {idUser: this.selfData.id}));
  //
  //   return this.http.post(`${this.apiEndpoint}/sms-login`, body, {
  //     search: this.getSearchParams('login')
  //   })
  //   .map(this.extractData.bind(this))
  //   .catch(this.handleError.bind(this))
  //   .do((res)=> {
  //     this.updateSelfData$.next(res);
  //   });
  // }

  handleError(error: any) {
    if (error.status == 401 || error.status == 404) {
      this.logout();
    }

    let body = JSON.parse(error._body);
    let errMsg = body.length ? body[0]['error_message'] : body['error_message'];

    this.toasterService.pop('error', errMsg);

    return Observable.throw(errMsg);
  }
}