import { Request, Http, Response } from '@angular/http';
import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ResourceCRUD } from 'ng2-resource-rest';
import { LocalStorage } from 'angular2-local-storage/local_storage';
import { CookieService } from 'angular2-cookie/services';

import { AppConfig, APP_CONFIG } from '../app.config';
import { ToasterService, UserService, SpinnerService } from '../core/services/index';
import { UserResource } from '../core/resources/user.resource';

export class CustomResourceCRUD extends ResourceCRUD<any,any,any> {
  public cookieService: CookieService;
  public localStorage: LocalStorage;
  public userService: UserService;
  public router: Router;
  public appConfig: AppConfig;
  public toasterService: ToasterService;
  public spinnerService: SpinnerService;
  public defaultOptions: any;
  
  constructor(
    protected http: Http,
    protected injector: Injector
  ) {
    super(http, injector);
    
    this.localStorage = injector.get(LocalStorage);
    this.cookieService = injector.get(CookieService);
    this.router = injector.get(Router);
    this.appConfig = injector.get(APP_CONFIG);
    this.toasterService = injector.get(ToasterService);
    this.spinnerService = injector.get(SpinnerService);
  }
  
  requestInterceptor(req: Request) {
    this.spinnerService.show();
    let token = this.localStorage.get('uptracker_token') || this.cookieService.get('uptracker_token');
    req.headers.append('Content-Type', 'application/json');
    req.headers.append('X_AUTH_TOKEN', token || null);
    return req;
  }
  
  responseInterceptor(observable: Observable<any>, request?: Request): Observable<any> {
    let self = this;
  
    return observable
      .map((res: Response) => {
        if(res.status == 204){
          return null;
        }
        this.spinnerService.hide();
        return res.json();
      })
      .catch((err: Response) => {
        let body = err.json();
        let errMsg = body.length ? body[0]['error_message'] || body[0]['error'] : body['error_message'] || body['error'];

        if (self instanceof UserResource && ((err.status == 401 || err.status == 404) || errMsg == "User doesn't exist.")) {
          UserService.logout(this.localStorage, this.cookieService, this.router, '/login');
        }

        this.spinnerService.hide();
        this.toasterService.pop('error', errMsg);
        return Observable.throw(errMsg);
      });
  }
  
  getUrl() {
    let url = super.getUrl();
    return `${this.appConfig.apiEndpoint}${url}`;
  }
  
  getParams() {
    let params = super.getParams();
    let expandParams = this.getEpandParams();
    Object.assign(
      params,
      {
        'per-page': 1000,
        // 'expand': expandParams,
      }
    );
    
    return params;
  }
  
  getEpandParams() {
    let expandParams = this.defaultOptions.expand.default || [];
    if (typeof expandParams == "string") {
      return expandParams;
    }
    
    var expandParamArr = [];
    for (var expandParam of expandParams) {
      
      if (typeof expandParam == "object") {
        for (var key in expandParam) {
          let el = expandParam[key];
          expandParamArr.push(key + ":" + el.join('|'));
        }
      } else {
        expandParamArr.push(expandParam);
      }
    }
    return expandParamArr.join(',');
  }
  
}