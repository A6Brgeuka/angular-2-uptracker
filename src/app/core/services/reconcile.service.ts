import { Injectable, Injector } from "@angular/core";
import { isNil } from 'ramda'
import { ModelService } from "../../overrides/model.service";
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

  public invoice$: BehaviorSubject<any> = new BehaviorSubject(null);
  public orders$: BehaviorSubject<any> = new BehaviorSubject(null);

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

  getReconcile(invoice_id, item_ids) {
    if (!isNil(invoice_id) && isNil(item_ids)) {
      return this.restangular.one('reconcile').customGET('', { invoice_id }).map(res => res.data);
    } else if (!isNil(invoice_id) && !isNil(item_ids)) {
      return this.restangular.one('reconcile').customGET('', { item_ids, invoice_id }).map(res => res.data);
    } else {
      return this.restangular.one('reconcile').customGET('', { item_ids }).map(res => res.data);
    }
  }

  createReconcile(data) {
    return this.restangular.all('reconcile').post(data)
    .do((res: any) => {
      console.log('CREATING RECONCILE --------------->>>>>>   ', res);
    });
  }

  lookInvoices(id) {
    if (isNil(id)) {
      return this.restangular.all('invoices').all('lookup').customGET('').map(res => res.data);;
    } else {
      return this.restangular.one('invoices').one('lookup').customGET('', {vendor_id: id}).map(res => res.data);
    }
  }
}
