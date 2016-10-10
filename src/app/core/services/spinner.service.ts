import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SpinnerService {
  loading$: Observable<any>;
  private updateSpinner$: Subject<any> = new Subject<any>();

  constructor() {
    this.loading$ = Observable.merge(
        this.updateSpinner$
    )
  }
  
  show() {
    this.updateSpinner$.next(true);
  }

  hide() {
    this.updateSpinner$.next(false);
  }
}