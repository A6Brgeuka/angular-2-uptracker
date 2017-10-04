import { Component, NgZone, OnInit } from '@angular/core';

import Quagga from 'quagga';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ToasterService } from '../../core/services/toaster.service';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

export class BarcodeScannerModalContext extends BSModalContext {
  public data: any;
}


@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss']
})

@DestroySubscribers()

export class BarcodeScannerModal implements OnInit, CloseGuard, ModalComponent<BarcodeScannerModalContext> {
  subscribers: any = {};
  context;
  CameraIsAvailable: boolean = false;
  quaggaConfig: any;
  barcodeRes: string = '';
  barcodeRes$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  codeImg: string = '';
  
  src$: ReplaySubject<string> = new ReplaySubject(1);
  
  constructor(
    public dialog: DialogRef<BarcodeScannerModalContext>,
    public toasterService: ToasterService,
    private ngZone: NgZone
  ) {
    this.context = dialog.context.data;
    dialog.setCloseGuard(this);
  
    this.quaggaConfig = {
      inputStream: {
        size: 320
      },
      locator: {
        patchSize: "x-large",
        halfSample: true
      },
      numOfWorkers: 1,
      decoder: {
        readers: ['upc_reader']
      },
      debug: {
        drawBoundingBox: false,
        showFrequency: false,
        drawScanline: false,
        showPattern: false
      },
      multiple: false,
      locate: true,
      src: null
    };
  }
  
  ngOnInit() {
    
  }
  
  addSubscribers() {
    this.subscribers.srcSubscriber = this.src$
    .map(src => ({...this.quaggaConfig,src}))
    .switchMap((config) =>
      this.decodeSingle(config)
      .pluck('codeResult')
      .catch(err =>
        Observable.of(false)
        .do(res => this.toasterService.pop('error', "not detected"))
      )
    )
    .subscribe((codeResult: any) => {
      this.ngZone.run(() => {
        this.barcodeRes = codeResult ? codeResult.code : '';
      })
    })
  }
  
  onChangeFile(file) {
    if (file.target.files.length) {
      this.codeImg = URL.createObjectURL(file.target.files[0]);
      this.onDecodeSingle(this.codeImg);
    }
  }
  
  rerun() {
    this.onDecodeSingle(this.codeImg);
  }
  
  onDecodeSingle(src) {
    this.src$.next(src);
  }
  
  decodeSingle(config) {
    //let conf = {...this.defouldconfig, ...config};
    let obs = Observable.create(observer => {
      Quagga.decodeSingle(config, result => {
        if(result.codeResult) {
          observer.next(result);
        } else {
          observer.error(result);
        }
      })
    });
    return obs;
  }
  
  dismissModal() {
    this.dialog.dismiss();
  }
  closeModal(data) {
    this.dialog.close(data);
  }
}