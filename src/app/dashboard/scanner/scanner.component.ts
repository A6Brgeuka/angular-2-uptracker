import { Observable } from 'rxjs/Observable';
import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';
import { ToasterService } from '../../core/services/toaster.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
@DestroySubscribers()
export class ScannerComponent implements OnInit {
  subscribers: any;
  selectedFile$: Subject<File>;
  barCode$: Subject<string>;
  qrCode$: Subject<string>;
  code$: Observable<[string, string]>;
  
  @Output() searchText = new EventEmitter();
  
  constructor(
    private ngZone: NgZone,
    public toasterService: ToasterService,
  ) {
  }
  
  ngOnInit() {
    this.subscribers = {};
    this.selectedFile$ = new Subject();
    this.barCode$ = new Subject();
    this.qrCode$ = new Subject();
    
    this.code$ = Observable.zip(
      this.barCode$,
      this.qrCode$
    );
  }
  
  addSubscribers() {
    this.subscribers.srcSubscriber = this.code$.subscribe(res => {
      //alert(res);
      console.log(res);
      let filteredRes = _.filter(res, null);
      this.ngZone.run(() => {
        if (filteredRes.length) {
          this.searchText.emit(filteredRes[0]);
        } else {
          this.toasterService.pop('error',  `not detected`);
        }
      });
    })
  }
  
  onChangeFile(file) {
    if (file.target.files.length) {
      this.selectedFile$.next(file.target.files[0]);
    }
  }
  
  onBarCodeUpdated(code){
    this.barCode$.next(code);
  }
  
  onQrCodeUpdated(code){
    this.qrCode$.next(code);
  }
}