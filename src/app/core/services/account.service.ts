import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { HttpClient } from './http.service';
import { ModelService } from '../../overrides/model.service';
import { UserService } from './user.service';
import { DefaultOptions } from '../../decorators/default-options.decorator';
import { Subscribers } from '../../decorators/subscribers.decorator';

@Injectable()
@DefaultOptions({
  modelEndpoint: '',
  expand: {
    default: [
      // {
      //   Account: ['owner', 'users'],
      //   User: ['deployments', 'cards']
      // }
    ],
  }
})
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class AccountService extends ModelService{
  
  // static STATUS_BLOCKED = 1;
  // static STATUS_ACTIVE = 2;
  
  selfData: any;
  selfData$: Observable<any>;
  updateSelfData$: Subject<any> = new Subject<any>();
  
  constructor(
    public injector: Injector,
    public http: HttpClient,
    public userService:UserService
  ) {
    super(injector);
  
    this.onInit();
  }
  
  onInit(){
    this.selfData$ = Observable.merge(
        this.updateSelfData$
    );
  }
  
  addSubscribers(){
    this.entity$.subscribe((res) => {
      //update user after update account
      // this.userService.loadSelfData();

      this.updateSelfData$.next(res);
    });
  }

  createCompany(data){
    let api = this.apiEndpoint + 'register/company';

    let body = JSON.stringify(data); 

    let entity = this.http.post(api, body)
        .map(this.extractData.bind(this))
        .catch(this.handleError.bind(this))
        .publish().refCount();

    entity.subscribe(
        (res: any) => {
          console.log(res.data.account);
          this.addToCollection$.next(res.data.account);
          this.updateEntity$.next(res.data.account);
          this.updateSelfData$.next(res.data.account);
        }
    );

    return entity;
  }
  
}