import { Injectable, Inject } from '@angular/core';
import { Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { HttpClient, ToasterService, SpinnerService } from '../core/services/index';
import { APP_CONFIG, AppConfig } from '../app.config';

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
  public appConfig: AppConfig;
  public spinnerService: SpinnerService;
  
  constructor(
      public injector
  ) {
    this.http = injector.get(HttpClient);
    this.toasterService = injector.get(ToasterService);
    this.spinnerService = injector.get(SpinnerService);
    this.appConfig = injector.get(APP_CONFIG);


    this.apiEndpoint = `${this.appConfig.apiEndpoint}/${this.defaultOptions.modelEndpoint}`;

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
      console.log(`${this.defaultOptions.childClassName} Entity Updated`, res);
    });
  }
  
  collectionActions() {
    let addToCollection$ = this.addToCollection$
    .switchMap((res) => {
      return this.collection$.first()
      .map(collection => {
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
      .map(collection => {
        return collection.filter((el) => {
          return el.id != id;
        });
      });
    });
    
    let updateElementCollection$ = this.updateElementCollection$
    .switchMap((entity) => {
      return this.collection$.first()
      .map(collection => {
        return collection.map((el) => {
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
      console.log(`${this.defaultOptions.childClassName} Collection Updated`, res);
    });
  }
  
  loadCollection(data: any = {}, options: any = {}): Observable<any> {
    this.http.get(this.apiEndpoint, {
      search: this.getSearchParams('loadCollection')
    })
    .map(this.extractData.bind(this))
    .catch(this.handleError.bind(this))
    .subscribe((res) => {
      this.loadCollection$.next(res);
    });
    
    return this.collection$;
  }
  
  loadEntity(data: any = {}, options: any = {}) {
    let entity = this.http.get(`${this.apiEndpoint}/${data.id}`, {
      search: this.getSearchParams('loadEntity')
    })
    .map(this.extractData.bind(this))
    .catch(this.handleError.bind(this))
    .publishReplay(1).refCount();
    
    entity.subscribe((res) => {
      this.loadEntity$.next(res);
    });
    
    return entity;
  }
  
  
  create(data = {}) {
    let body = JSON.stringify(data);
    
    let entity = this.http.post(this.apiEndpoint, body, {
      search: this.getSearchParams('create')
    })
    .map(this.extractData.bind(this))
    .catch(this.handleError.bind(this))
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
    let body = JSON.stringify(data);
    let entity = this.http.put(`${this.apiEndpoint}/${data.id}`, body, {
      search: this.getSearchParams('update')
    })
    .map(this.extractData.bind(this))
    .catch(this.handleError.bind(this))
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
    this.http.delete(`${this.apiEndpoint}/${id}`)
    // .map(this.extractData.bind(this))
    .catch(this.handleError.bind(this))
    .subscribe((res) => {
      this.deleteFromCollection$.next(id);
      this.deleteEntity$.next(id);
    });
    
    return Observable.of(true);
  }
  
  public extractData(res: Response) {
    let body = res.json();
    return body || {};
  }
  
  public handleError(error: any) {
    let body = JSON.parse(error._body);
    let errMsg = body.length ? body[0]['error_message'] : body['error_message'];

    this.spinnerService.hide();
    this.toasterService.pop('error', errMsg);
    
    return Observable.throw(errMsg);
  }
  
  getSearchParams(action) {
    let searchParams: URLSearchParams = new URLSearchParams();
    
    let expandFromAction = this.defaultOptions.expand[action] || [];
    let expandDefault = this.defaultOptions.expand.default || [];
    // let expand = expandDefault.concat(expandFromAction).join(',');
    let expand = this.getExpandParamsString(expandDefault);
    if (expand) {
      searchParams.set('expand', expand);
    }
  
    searchParams.set('per-page', '2000');
    return searchParams;
  }
  
  getExpandParamsString(expandParams) {
    if (typeof expandParams == "string") {
      return expandParams;
    }
    
    let expandParamArr = [];
    for (let expandParam of expandParams) {
      
      if (typeof expandParam == "object") {
        for (let key in expandParam) {
          let el = expandParam[key];
          expandParamArr.push(key + ":" + el.join('|'));
        }
      } else {
        expandParamArr.push(expandParam);
      }
    }
    return expandParamArr.join(',');
  }
}
