import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SpinnerService {
  loading$: Observable<any>;
  private updateSpinner$: Subject<any> = new Subject<any>();
  private counter: number = 0;

  constructor() {
    this.loading$ = Observable.merge(
        this.updateSpinner$
    )
  }
  
  show() {
    this.counter++;
    this.updateSpinner$.next(true);
  }

  hide() {
    this.counter--;
    if  (this.counter == 0)
      this.updateSpinner$.next(false);
  }
}