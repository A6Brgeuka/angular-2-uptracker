import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable()
export class StateService {
  url: string;
  navigationEndUrl: string = '';
  
  constructor(
    public router: Router,
  ) {
    router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event) => {
        this.navigationEndUrl = event.url;
      });
  }

  isUrl(url){
    return this.navigationEndUrl == url;
  }
  
  isNotUrl(url){
    return !this.isUrl(url);
  }
  
  isPartUrl(part) {
    let re = new RegExp(part, 'gi');
    return this.navigationEndUrl.search(re) >= 0;
  }
}
