import { ConnectableObservable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Restangular } from 'ngx-restangular';

import { OrdersService } from '../orders.service';
import { StateService } from '../../../core/services/state.service';

export abstract class EntitiesService {
  public entities$: ConnectableObservable<{ [id: string]: any }>;
  public voidOrder$: Subject<any> = new Subject();
  public voidOrderRequest$: ConnectableObservable<any>;
  protected addCollectionToEntittesStream$: Subject<Observable<any>> = new Subject();
  public removeIds$;

  public filterQueryParams$: Observable<any>;

  protected abstract idName: string;
  protected abstract url: string;

  constructor(
    public restangular: Restangular,
    public ordersService: OrdersService,
    public stateService: StateService,
  ) {
    this.filterQueryParams$ = this.ordersService.filterQueryParams$
    .filter((filterObj) => this.stateService.isUrl(this.url));

    this.voidOrderRequest$ = this.voidOrder$
    .switchMap((data) =>
      this.restangular.one('pos', 'void').customPOST(data)
      .map(res => res.data)
    ).publish();
    this.voidOrderRequest$.connect();

    this.removeIds$ = this.voidOrderRequest$
    .filter((filterObj) => this.stateService.isUrl(this.url))
    .map((voidedOrders) => voidedOrders.map((order) => order[this.idName]));

    this.addCollectionStreamToEntittesStream(this.voidOrderRequest$);

    this.entities$ = this.addCollectionToEntittesStream$
    .mergeAll()
    .scan((acc, items: any[]) => {
      const newEntities = items.reduce((itemEntities, item) => {
        const oldEntity = acc[item[this.idName]];
        const entityToSet = oldEntity ? {...oldEntity, ...item} : item;
        return {
          ...itemEntities,
          [item[this.idName]]: entityToSet,
        };
      }, {});

      return {...acc, ...newEntities};
    }, {})
    .publishReplay(1);
    this.entities$.connect();
  }

  onVoidOrder(data) {
    this.voidOrder$.next(data);
    return this.voidOrderRequest$;
  }

  /**
   * Used to add stream as source for entities
   * @param {Observable<any>} stream$
   */
  public addCollectionStreamToEntittesStream(stream$: Observable<any>) {
    this.addCollectionToEntittesStream$.next(stream$);
  }

}
