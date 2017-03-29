import { ModelService } from "../../overrides/model.service";
import { Injectable, Injector } from "@angular/core";
import { Subscribers } from "../../decorators/subscribers.decorator";
import { Restangular } from "ng2-restangular";
import { APP_CONFIG, AppConfig } from "../../app.config";
import { Observable, BehaviorSubject } from "rxjs";
import * as _ from 'lodash';
import { UserService } from "./user.service";
import { AccountService } from "./account.service";

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class CartService extends ModelService {
  private appConfig: AppConfig;
  constructor(
    public injector: Injector,
    public restangular: Restangular,
    public userService: UserService,
    public accountService: AccountService
  ) {
    super(restangular);
    this.appConfig = injector.get(APP_CONFIG);
    this.onInit();
  }

  onInit() {
    this.loadCollection$ = this.restangular.all('cart').customGET('')
    .map((res: any) => {
      return res.data.items;
    })
    .do((res: any) => {
      this.updateCollection$.next(res);
    })
    .take(1)
    .subscribe();
    console.log("order service loaded");
  }
}
