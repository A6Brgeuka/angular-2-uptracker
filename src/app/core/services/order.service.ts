import { Injectable, Injector } from '@angular/core';

import { Restangular } from 'ngx-restangular';
import { Subscribers } from '../../decorators/subscribers.decorator';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as _ from 'lodash';

import { ModelService } from '../../overrides/model.service';
import { APP_CONFIG, AppConfig } from '../../app.config';
import { UserService } from './user.service';
import { AccountService } from './account.service';

export class ConvertData {
  vendor_id: string[];
  location_id: string;
}

export class OrderOptions {
  primary_tax: number;
  secondary_tax: number;
  shipping_handling: number;
  ship_to: string;
  order_method: string;
}

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class OrderService extends ModelService {
  public appConfig: AppConfig;
  public convertData: ConvertData | null;
  public itemsVisibility: boolean[];
  public pastOrders$: BehaviorSubject<any> = new BehaviorSubject([]);
  
  constructor(
    public injector: Injector,
    public restangular: Restangular,
    public userService: UserService,
    public accountService: AccountService
  ) {
    super(restangular);
    this.appConfig = injector.get(APP_CONFIG);
   
  }
  
  getOrder(orderId: string) {
    return this.restangular.one('orders', orderId).all('preview').customGET('')
    .map((res: any) => {

      return res.data.map((item: any) => {
        item.primary_tax_nf /= 100;
        item.secondary_tax_nf /= 100;
        item.shipping_handling_nf /= 100;
        item.sub_total_nf /= 100;
        item.total_nf /= 100;
        return item;
      });
    })
    .do((res: any) => {
      this.updateCollection$.next(res);
    });
  }
  
  updateOrder(orderId: string, data: OrderOptions) {
    return this.restangular.one('orders', orderId).all('preview').customPUT(data)
    .map((res: any) => {
      return res.data.map((item: any) => {
        item.primary_tax_nf /= 100;
        item.secondary_tax_nf /= 100;
        item.shipping_handling_nf /= 100;
        item.sub_total_nf /= 100;
        item.total_nf /= 100;
        return item;
      });
    });
    // update order data
  }
  
  convertOrders(orderId: string, data: ConvertData) {
    return this.restangular.one('orders', orderId).all('convert').customPOST(data);
  }

  sendOrderRequest(orderId) {
    return this.restangular.one('po', orderId).all('send').customGET()
      .map((res: any) => res.data);
  }
  
  sendOrderRequestFinal(orderId, data: any) {
    // POST /po/{order_id}/send
    return this.restangular.one('po', orderId).all('send').customPOST(data)
      .map((res: any) => res.data);
  }

  calcTT(items) {
    let tt = 0;
    _.each(items, (i: any) => {
      tt += i.total_nf;
    });
    items.total_total = tt;
    return this.updateCollection$.next(items);
  }

}
