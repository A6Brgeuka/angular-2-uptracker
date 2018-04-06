import { Injectable } from '@angular/core';

import { EntitiesService } from '../../classes/entities.service';

@Injectable()
export class OrderItemsTableService extends EntitiesService {
  protected idName = 'id';
}
