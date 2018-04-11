import { Injectable } from '@angular/core';

import { EntitiesService } from '../../classes/entities.service';
import { Restangular } from 'ngx-restangular';

@Injectable()
export class PackingSlipsTableService extends EntitiesService {
  protected idName = 'id';

  constructor(
    public restangular: Restangular,
  ) {
    super(restangular);
  }
}
