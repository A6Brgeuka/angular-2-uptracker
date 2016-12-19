import { ModelService } from "../../overrides/model.service";
import { Injectable, Injector } from "@angular/core";
import { Subscribers } from "../../decorators/subscribers.decorator";
import { Restangular } from "ng2-restangular";
import { AppConfig, APP_CONFIG } from "../../app.config";
import { Observable, BehaviorSubject } from "rxjs";
import * as _ from 'lodash';
import { Http } from "@angular/http";
import { UserService } from "./user.service";
import { AccountService } from "./account.service";

@Injectable()
@Subscribers({
  initFunc: 'ngOnInit',
  destroyFunc: null,
})
export class LocationService extends ModelService {
  public appConfig: AppConfig;
  public selfData$: Observable<any>;
  public selfData: any;
  public updateSelfData$ = new BehaviorSubject(null);

  public subscribers: any;


  constructor(

    public injector: Injector,
    public restangular: Restangular,
    public http: Http,
    public userService: UserService,
    public accountService: AccountService
  ) {
    super(restangular);

    this.appConfig = injector.get(APP_CONFIG);

  }

  ngOnInit() {
    this.selfData$ = Observable.merge(
      this.updateSelfData$
    );
    this.updateSelfData$.subscribe(res => {
      debugger;
      this.selfData = res;

      console.log(`${this.constructor.name} Update SELF DATA`, res);

      this.accountService.updateSelfData(this.selfData);
    })
  }

  addSubscribers() {
    // this.subscribers.selfData$ = this.selfData$.subscribe(res => {
    //   debugger;
    //   this.selfData = res;
    //
    //   console.log(`${this.constructor.name} Update SELF DATA`, res);
    //
    //   this.accountService.updateSelfData(this.selfData);
    // })
  }


  getLocationStreetView(params) {
    return this.http.get(this.getLocationStreetViewUrl(params, true))
  }

  getLocationStreetViewUrl(params, type?) {
    let url = this.appConfig.streetView.endpoint;
    if(type) {
      url += "/metadata";
    }
    params.key = this.appConfig.streetView.apiKey;
    params.size = '520x293';

    let imageUrl = url + '?size=' + params.size + '&key=' + params.key + '&location=' + params.location;
    return imageUrl.replace(/\s/g,'%20').replace(/#/g, '');
  }

  deleteLocation(data: any){
    return this.restangular.one('accounts', this.userService.selfData.account_id).one('locations', data.id).remove()
      .do((res: any) => {
        let account = this.accountService.selfData;

        account.users = _.map(account.users, (user: any) => {
          _.remove(user.locations, (location: any) => location.location_id == data.id);
          return user;
        });

        _.remove(account.locations, (location: any) => {
          return location.id == data.id;
        });
        this.accountService.updateSelfData(account);
      });
  }

  updateSelfData(data) {

    this.updateSelfData$.next(data)
  }
}
