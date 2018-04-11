import { Injectable } from '@angular/core';

import { EntitiesService } from '../../classes/entities.service';
import { Restangular } from 'ngx-restangular';

@Injectable()
export class OrdersTableService extends EntitiesService {
  protected idName = 'order_id';

  constructor(
    public restangular: Restangular,
  ) {
    super(restangular);
  }

}
