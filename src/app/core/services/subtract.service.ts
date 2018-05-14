import { Injectable, Injector } from "@angular/core";
import { isNil } from 'ramda'
import { ModelService } from "../../overrides/model.service";
import { Subscribers } from "../../decorators/subscribers.decorator";
import { Restangular } from "ngx-restangular";
import { APP_CONFIG, AppConfig } from "../../app.config";
import { Observable, BehaviorSubject } from "rxjs";
import { UserService } from "./user.service";
import { AccountService } from "./account.service";
import 'rxjs/add/operator/map';


@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class SubtractService extends ModelService {
  public appConfig: AppConfig;

  public inventories$: BehaviorSubject<any> = new BehaviorSubject(null);
  public inventory$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    public injector: Injector,
    public restangular: Restangular,
    public userService: UserService,
    public accountService: AccountService
  ) {
    super(restangular);
    this.appConfig = injector.get(APP_CONFIG);
  }

  searchInventory(query, limit, page) {
    return this.restangular.one('inventory').customGET('', { query, limit, page }).map(res => {
      this.inventories$.next(res.data);
      return res.data;
    });
  }

  getInventory(id) {
    return this.restangular.one('inventory', id).customGET().map(res => {
      this.inventory$.next(res.data);
      return res.data;
    });
  }

  submitInventory(id, data) {
    return this.restangular.one('inventory', id).all('level').customPUT(data)
    .do((res: any) => {});
  }
}
