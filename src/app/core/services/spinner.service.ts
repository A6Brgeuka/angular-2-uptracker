import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SpinnerService {
  loading$: Observable<any>;
  private updateSpinner$: Subject<any> = new Subject<any>();

  constructor(
  ) {
    // this.loading$ = new Observable(
    //     // observer => this._observer = observer
    //     (observer) => this._observer.subscribe(observer)
    // ).share();
    this.loading$ = Observable.merge(
        this.updateSpinner$
    )
  }

  ngOnInit(){
  }
  
  show() {
    this.updateSpinner$.next(true);
  }

  hide() {
    this.updateSpinner$.next(false);
  }
}