import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { OrderItem } from '../models/order-item';

export abstract class OrderListBaseService {

  public getCollectionRequest$: Observable<any>;
  public getCollection$: Subject<any> = new Subject();
  public collection$: Observable<OrderItem[]>;
  public ids$: ConnectableObservable<string[]>;


  constructor(
    entities$: Observable<{[id: string]: any}>
  ) {
    this.getCollectionRequest$ = this.getCollection$
    .switchMap(() =>
      this.getRequest()
      .map((res: any) => res.data)
      .catch((error) => Observable.never())
    )
    .share();

    this.ids$ = this.getCollectionRequest$
    .map((items) => items.map((item) => item.id))
    .publishBehavior([]);
    this.ids$.connect();

    this.collection$ = Observable.combineLatest(
      entities$,
      this.ids$,
    )
    .map(([entities, ids]) => ids.map((id) => entities[id]));
  }

  getCollection() {
    this.getCollection$.next(null);
    return this.getCollectionRequest$;
  }

  protected abstract getRequest(): Observable<any>;
}
