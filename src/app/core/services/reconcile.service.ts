import { ModelService } from "../../overrides/model.service";
import { Injectable, Injector } from "@angular/core";
import { Subscribers } from "../../decorators/subscribers.decorator";
import { Restangular } from "ngx-restangular";
import { APP_CONFIG, AppConfig } from "../../app.config";
import { Observable, BehaviorSubject } from "rxjs";
import * as _ from 'lodash';
import { UserService } from "./user.service";
import { AccountService } from "./account.service";

import 'rxjs/add/operator/map';

export class ConvertData {
  vendor_id: string[];
  location_id: string;
}

export class Invoice {
  invoice_line_item_id: string
  discount: string
  discounted_price: string
  order_line_item_id: string
  order_qty: number
  package_price: string
  received_qty: number
}


@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class ReconcileService extends ModelService {
  public appConfig: AppConfig;
  public invoices: Array<Invoice>;

  constructor(
    public injector: Injector,
    public restangular: Restangular,
    public userService: UserService,
    public accountService: AccountService
  ) {
    super(restangular);
    this.appConfig = injector.get(APP_CONFIG);
  }

  getInvoices() {
    return this.restangular.all('pos').all('all').customGET('');
  }

  getReconcile() {
    return this.restangular.one('reconcile').customGET('', {item_ids: '5ad4f32e3d0192000d3acf1e'}).map(res => res.data);
  }

  createReconcile(data) {
    return this.restangular.all('reconcile').post(data)
    .do((res: any) => {
      console.log('--------------->>>>>>   ', res);
    });
  }
}
