import { Request, Http, Response } from '@angular/http';
import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ResourceCRUD } from 'ng2-resource-rest';

import { ToasterService, SpinnerService } from '../core/services/index';

export class StreetViewResourceCRUD extends ResourceCRUD<any,any,any> {
  public router: Router;
  public toasterService: ToasterService;
  public spinnerService: SpinnerService;
  public defaultOptions: any;
  
  constructor(
    protected http: Http,
    protected injector: Injector,
  ) {
    super(http, injector);
    
    this.router = injector.get(Router);
    this.toasterService = injector.get(ToasterService);
    this.spinnerService = injector.get(SpinnerService);
  }
  
  requestInterceptor(req: Request) {
    this.spinnerService.show();
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

        this.spinnerService.hide();

        let body = err.json();
        let errMsg = body.length ? body[0]['error_message'] || body[0]['error'] : body['error_message'] || body['error'];
        this.toasterService.pop('error', errMsg);

        return Observable.throw(errMsg);
      });
  }
  
  getUrl() {
    let url = super.getUrl();
    return `http://maps.googleapis.com/maps/api/streetview`;
  }
  
  getParams() {
    let params = super.getParams();
    let expandParams = this.getExpandParams();
    Object.assign(
      params,
      {
        'key': 'YOUR_API_KEY',
        'size': '520x293',
        'expand': expandParams
      }
    );
    
    return params;
  }
  
  getExpandParams() {
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