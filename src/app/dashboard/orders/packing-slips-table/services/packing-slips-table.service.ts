import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Restangular } from 'ngx-restangular';

import { EntitiesService } from '../../classes/entities.service';
import { OrdersService } from '../../orders.service';

@Injectable()
export class PackingSlipsTableService extends EntitiesService {
  protected idName = 'id';

  constructor(
    public restangular: Restangular,
    public ordersService: OrdersService,
    public router: Router,
  ) {
    super(restangular, ordersService, router);
  }
}
