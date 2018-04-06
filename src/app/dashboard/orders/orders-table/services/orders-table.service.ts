import { Injectable } from '@angular/core';

import { EntitiesService } from '../../classes/entities.service';

@Injectable()
export class OrdersTableService extends EntitiesService {
  protected idName = 'order_id';
}
