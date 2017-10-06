import { Observable } from 'rxjs/Observable';
import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';
import { ToasterService } from '../../core/services/toaster.service';
import { SpinnerService } from '../../core/services/spinner.service';

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
  videoStreamUrl: string;
  window: any;
  navigator: any;
  startStream$: Subject<any>;
  stopStream$: Subject<any>;
  
  @Output() searchText = new EventEmitter();
  
  @ViewChild('canvas') canvas;
  @ViewChild('video') video;
  
  constructor(
    private ngZone: NgZone,
    public toasterService: ToasterService,
    public spinnerService: SpinnerService,
  ) {
  }
  
  ngOnInit() {
    this.subscribers = {};
    this.selectedFile$ = new Subject();
    this.barCode$ = new Subject();
    this.qrCode$ = new Subject();
    
    this.startStream$ = new Subject();
    this.stopStream$ = new Subject();
    
    this.navigator = navigator;
    this.window = window;
    
    this.code$ = Observable.zip(
      this.barCode$,
      this.qrCode$
    );
    console.log(this.navigator.mediaDevices.ondevicechange);
  }
  
  captureMe() {
    let canvas: HTMLCanvasElement = this.canvas.nativeElement;
    let video: HTMLVideoElement = this.video.nativeElement;
    let context: CanvasRenderingContext2D = canvas.getContext('2d');
    
    if (!this.videoStreamUrl) return;
    // переворачиваем canvas зеркально по горизонтали (см. описание внизу статьи)
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    // отрисовываем на канвасе текущий кадр видео
    context.drawImage(video, 0, 0, video.width, video.height);
    // получаем data: url изображения c canvas
    let base64dataUrl = canvas.toDataURL('image/png');
    
    let file = this.dataURLtoFile(base64dataUrl, 'img');
    
    
    this.ngZone.run(() => {
      this.selectedFile$.next(file);
    });
  };
  
  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
  }
  
  addSubscribers() {
    this.subscribers.srcSubscriber = this.code$.subscribe(res => {
      //alert(res);
      console.log(res);
      let filteredRes = _.filter(res, null);
      this.ngZone.run(() => {
        if (filteredRes.length) {
          this.searchText.emit(filteredRes[0]);
          
          this.onStopStrem()
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
  
  onStopStrem(){
    //this.subscribers.qwe.unsubscribe();
    this.videoStreamUrl = '';
    this.video.nativeElement.src = this.videoStreamUrl;
  }
  
  onStartStream(){
    this.navigator.getUserMedia = this.navigator.getUserMedia || this.navigator.webkitGetUserMedia || this.navigator.mozGetUserMedia || this.navigator.msGetUserMedia;
    this.window.URL.createObjectURL = this.window.URL.createObjectURL || this.window.URL.webkitCreateObjectURL || this.window.URL.mozCreateObjectURL || this.window.URL.msCreateObjectURL;
    // запрашиваем разрешение на доступ к поточному видео камеры
    this.navigator.getUserMedia({video: true}, (stream) => {
      this.ngZone.run(() => {
        this.videoStreamUrl = this.window.URL.createObjectURL(stream);
        this.video.nativeElement.src = this.videoStreamUrl;
        
        this.subscribers.qwe = Observable.interval(300)
        .subscribe(() => {
          this.captureMe()
        })
        
      });
    }, function () {
      console.log('что-то не так с видеостримом или пользователь запретил его использовать :P');
    });
  }
  
  onBarCodeUpdated(code) {
    this.barCode$.next(code);
  }
  
  onQrCodeUpdated(code) {
    this.qrCode$.next(code);
  }
}