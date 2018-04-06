import { Injectable } from '@angular/core';

import { ConnectableObservable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Restangular } from 'ngx-restangular';

@Injectable()
export abstract class EntitiesService {
  public entities$: ConnectableObservable<{ [id: string]: any }>;
  public voidOrder$ = new Subject();
  public voidOrderRequest$: ConnectableObservable<any>;
  protected addCollectionToEntittesStream$: Subject<Observable<any>> = new Subject();
  public removeIds$;

  protected abstract idName: string;

  constructor(
    public restangular: Restangular,
  ) {

    this.voidOrderRequest$ = this.voidOrder$
    .switchMap((data) =>
      this.restangular.one('pos', 'void').customPOST(data)
      .map(res => res.data)
    ).publish();
    this.voidOrderRequest$.connect();

    this.removeIds$ = this.voidOrderRequest$
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
