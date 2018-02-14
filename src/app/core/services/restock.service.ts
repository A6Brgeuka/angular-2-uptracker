import { Injectable, Injector } from '@angular/core';
import {Subscribers} from '../../decorators/subscribers.decorator';
import {ModelService} from '../../overrides/model.service';
import { APP_CONFIG, AppConfig } from '../../app.config';
import { Observable } from 'rxjs';
import {Restangular} from 'ngx-restangular';

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null
})

export class RestockService extends ModelService {
  public appConfig: AppConfig;
  public selfData$: Observable<any>;

  constructor(
    public injector: Injector,
    public restangular: Restangular,

  ) {
    super(restangular);
    this.appConfig = injector.get(APP_CONFIG)
    this.onInit()
  }

  onInit() {
    this.selfData$ = this.restangular.all('restock').customGET()
      .filter((data: any) => data.data && data.data.html)
      .map((data: any) => data.data.html)
  }
}
