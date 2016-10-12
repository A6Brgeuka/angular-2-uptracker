import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { HttpClient, ToasterService, SpinnerService } from '../core/services/index';

@Injectable()
export class ModelService {
  collection$: Observable<any> = new Observable<any>();
  loadCollection$: Subject<any> = new Subject<any>();
  addToCollection$: Subject<any> = new Subject<any>();
  deleteFromCollection$: Subject<any> = new Subject<any>();
  updateCollection$: Subject<any> = new Subject<any>();
  updateElementCollection$: Subject<any> = new Subject<any>();
  
  entity$: Observable<any>;
  loadEntity$: Subject<any> = new Subject<any>();
  deleteEntity$: Subject<any> = new Subject<any>();
  updateEntity$: Subject<any> = new Subject<any>();
  
  collection;
  
  public apiEndpoint: string;
  public defaultOptions: any;
  public http: HttpClient;
  public toasterService: ToasterService;
  public spinnerService: SpinnerService;
  
  constructor(
      public injector,
      public resource
  ) {
    this.http = injector.get(HttpClient);
    this.toasterService = injector.get(ToasterService);
    this.spinnerService = injector.get(SpinnerService);


    this.entityActions();
    this.collectionActions();
  }
  
  entityActions() {
    let deleteEntity$ = this.deleteEntity$
    .switchMap((id) => {
      return this.entity$.first()
      .filter(entity => {
        return entity && entity.id == id;
      })
      .mapTo(null);
    });
    
    this.entity$ = Observable.merge(
      this.loadEntity$,
      this.updateEntity$,
      deleteEntity$
    )
    .publishReplay(1).refCount();
    this.entity$.subscribe(res => {
      this.updateElementCollection$.next(res);
      console.log(`${this.constructor.name} Entity Updated`, res);
    });
  }
  
  collectionActions() {
    let addToCollection$ = this.addToCollection$
    .switchMap((res) => {
      return this.collection$.first()
      .map((collection: any) => {
        collection.push(res);
        return collection;
      });
    });
    
    // this.deleteFromCollection$.subscribe(res=>{
    //  console.log(res);
    // })
    
    let deleteFromCollection$ = this.deleteFromCollection$
    .switchMap((id) => {
      
      this.collection$.subscribe((res) => {
        console.log(res);
      });
      
      return this.collection$.first()
      .map((collection: any) => {
        return collection.filter((el: any) => {
          return el.id != id;
        });
      });
    });
    
    let updateElementCollection$ = this.updateElementCollection$
    .switchMap((entity) => {
      return this.collection$.first()
      .map((collection: any) => {
        return collection.map((el: any) => {
          if (el.id == entity.id) {
            return entity;
          }
          return el;
        });
      });
    });
    
    this.collection$ = Observable.merge(
      this.loadCollection$,
      this.updateCollection$,
      updateElementCollection$,
      addToCollection$,
      deleteFromCollection$
    ).publishReplay(1).refCount();
    this.collection$.subscribe(res => {
      this.collection = res;
      console.log(`${this.constructor.name} Collection Updated`, res);
    });
  }
  
  loadCollection(data: any = {}, options: any = {}): Observable<any> {
    this.resource.query(data).$observable
        .subscribe((res)=> {
          this.loadCollection$.next(res);
        });
    
    return this.collection$;
  }
  
  loadEntity(data: any = {}, options: any = {}) {
    let entity = this.resource.get(data).$observable
        .publishReplay(1).refCount();
    
    entity.subscribe((res) => {
      this.loadEntity$.next(res);
    });
    
    return entity;
  }
  
  
  create(data = {}) {
    let entity = this.resource.save(data).$observable
        .publish().refCount();
    
    entity.subscribe(
      (res) => {
        this.addToCollection$.next(res);
        this.updateEntity$.next(res);
      },
      (err) => {
      }
    );
    
    return entity;
  }
  
  update(data) {
    let entity = this.resource.update(data).$observable
        .publishReplay(1).refCount();
    
    entity.subscribe(
      (res) => {
        this.updateElementCollection$.next(res);
        this.updateEntity$.next(res);
      },
      (err) => {
      }
    );
    
    return entity;
  }
  
  delete(id: number): Observable<any> {
    this.resource.remove({id: id}).$observable
        .subscribe(res=>{
          this.deleteFromCollection$.next(id);
          this.deleteEntity$.next(id);
        });
    
    return Observable.of(true);
  }
}
