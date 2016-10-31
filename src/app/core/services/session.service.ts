import { Injectable } from '@angular/core';

import { LocalStorage } from 'angular2-local-storage/local_storage';
import { CookieService } from 'angular2-cookie/services';

@Injectable()
export class SessionService {
  public session: any = {};
  
  constructor(
      private localStorage: LocalStorage,
      private cookieService: CookieService
  ) {
  }

  set(title, value){
    try{
      this.localStorage.set(title, value);
    } catch(err){
      try{
        this.cookieService.put(title, value);
      } catch(err){
        this.session[title] = value;
      }
    }
  }

  get(title){
    try{
      return this.localStorage.get(title);
    } catch(err){
      try{
        return this.cookieService.get(title);
      } catch(err){
        return this.session[title];
      }
    }
  }

  remove(title){
    try{
      this.localStorage.remove(title);
    } catch(err){
      try{
        this.cookieService.remove(title);
      } catch(err){
        this.session[title] = null;
      }
    }
  }
  
}
