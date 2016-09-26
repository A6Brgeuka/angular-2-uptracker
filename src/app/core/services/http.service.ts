import { Injectable }     from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { LocalStorage } from 'angular2-local-storage/local_storage';

@Injectable()
export class HttpClient {
  
  constructor(
    public localStorage:LocalStorage,
    public http:Http
  ) {
  }
  
  createAuthorizationHeader(headers:Headers) {
    headers.append('Content-Type', 'application/json');
    // headers.append('Authorization', 'Bearer ' + this.localStorage.get('uptracker_token') || null);
  }
  
  get(url, params?) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(
      url,
      Object.assign({}, {
        headers: headers,
      }, params)
    );
  }
  
  post(url, data?, params?) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data,
      Object.assign({}, {
        headers: headers
      }, params)
    );
  }
  
  put(url, data, params?) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.put(url, data,
      Object.assign({}, {
        headers: headers
      }, params)
    );
  }
  
  delete(url, params = {}) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    
    return this.http.delete(url,
      Object.assign({}, {
        headers: headers
      }, params)
    );
  }
}