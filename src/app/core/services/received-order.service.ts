import { ModelService } from '../../overrides/model.service';
import { Injectable, Injector } from '@angular/core';
import { Subscribers } from '../../decorators/subscribers.decorator';
import { Restangular } from 'ngx-restangular';
import { APP_CONFIG, AppConfig } from '../../app.config';
import * as _ from 'lodash';
import { UserService } from './user.service';
import { AccountService } from './account.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { OrderReceivingStatus } from '../../dashboard/orders/receive/models/order-item-status-form.model';
import { ReceiveFormModel } from '../../dashboard/orders/receive/models/receive-form.model';

// TODO remove temprorary data
// const testData: ReceiveFormModel = {
//   invoice_number: '',
//   packing_slip_number: '',
//   orders: [{
//     order_id: '111',
//     po_number: 'PO NUM',
//     items: [{
//       id: 'item_id',
//       quantity: 5,
//       item_name: 'item name',
//       location_name: 'location name',
//       location_id: 'locationId',
//       status: [{
//         type: 'Received',
//         qty: 5,
//         location_id: '1111',
//         storage_location_id: '111',
//         status: 'Received',
//         inventory_group_name: 'invGroup',
//         location_name: 'Location name',
//         storage_location_name: 'Storage Location',
//         primary_status: false,
//       }],
//       status_line_items: [{
//         type: 'Received',
//         qty: 5,
//         location_id: '1111',
//         storage_location_id: '111',
//         status: 'Received',
//         inventory_group_name: 'invGroup',
//         location_name: 'Location name',
//         storage_location_name: 'Storage Location',
//         primary_status: false,
//       }],
//       inventory_group_id: 'inv_group_id',
//     }],
//   }],
//   vendor: {vendor_name: 'vendor', vendor_id: '11111111'},
// };

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class ReceivedOrderService extends ModelService {
  public appConfig: AppConfig;
  public statusList: OrderReceivingStatus[] = [];
  public statusList$: Observable<OrderReceivingStatus[]>;
  public getStatusList$: Subject<any> = new Subject<any>();

  constructor(
    public injector: Injector,
    public restangular: Restangular,
    public userService: UserService,
    public router: Router,
    public accountService: AccountService,
  ) {
    super(restangular);
    this.appConfig = injector.get(APP_CONFIG);

    this.statusList$ = this.getStatusList$
    .switchMap(() =>
      this.restangular.one('config', 'order_receiving_status').customGET('')
    )
    .map((response: any) => response.data)
    .shareReplay(1);

    this.statusList$.subscribe((statusList) => this.statusList = statusList);
  }


  getReceiveProduct(queryParams) {
    let params: any[] = queryParams.split('&');
    let orderIds = params[0];
    let itemsIds = params[1];

    if(itemsIds) {
      return this.restangular.all('receive').customGET('', {'order_ids': orderIds, 'items_ids' : itemsIds})
      .map(res => res.data);
    } else {
      return this.restangular.all('receive').customGET('', { 'item_ids' : queryParams })
      .map(res => res.data);
    }
    // return Observable.of(testData);
  }

  getStatusList() {
    this.getStatusList$.next(null);
    return this.statusList$;
  }

  onReceiveProducts(productsToReceive) {
    return this.restangular.all('receive').customPOST(productsToReceive);
  }

  getProductFields(variantId) {
    return this.restangular.one('inventory', 'search').customGET('', {'variant_id' : variantId})
    .map(res => res.data.results[0]);
  }

}
