import { Injectable, ViewContainerRef, ComponentRef, Injector } from '@angular/core';
import { Overlay, overlayConfigFactory, DOMOverlayRenderer, DialogRef, ModalOverlay } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Subject } from 'rxjs/Rx';


@Injectable()
export class CustomRenderer extends DOMOverlayRenderer{
  render(dialog: DialogRef<any>, vcRef: ViewContainerRef, injector?: Injector): ComponentRef<ModalOverlay> {
    let cmpRef = super.render(dialog, vcRef, injector);
    (<any>cmpRef)._viewRef.rootNodes[0].className += 'transparent-bg';
    
    return cmpRef;
  }
}


@Injectable()
export class ModalWindowService {
  private scrollTop$: Subject<any> = new Subject<any>();
  private scrollTop: number;

  constructor(
      public modal: Modal,
      private overlay: Overlay,
      private _modalRenderer: CustomRenderer

  ) {
  }
  
  confirmModal(title, body = '', fn = () => {}){
    this.modal.confirm()
        .isBlocking(false)
        .showClose(false)
        .keyboard(27)
        //.dialogClass('modal-confirm')
        .title(title)
        .body(body)
        .okBtnClass('btn-confirm uptracker-form-btn waves-effect waves-light')
        .cancelBtnClass('cancel-btn')
        .open()
        .then((resultPromise)=>{
          resultPromise.result.then(
              (res) => {
                fn();
              },
              (err) => {
              }
          );
        });
  }

  saveScrollPosition(){
    this.scrollTop = document.body.scrollTop;
    this.scrollTop$.next(document.body.scrollTop);
  }

  setScrollPosition(){
    document.body.scrollTop = this.scrollTop || 0;
  }
  
  customModal(vcRef: ViewContainerRef, modal, data, fn = null){
    this.saveScrollPosition();
    this.modal
      .open(modal,  overlayConfigFactory(data, BSModalContext))
        .then((resultPromise)=>{
          resultPromise.result.then(
              (res) => {
                this.setScrollPosition();
                if (!fn) return;

                fn(res);
              },
              (err) => {
                this.setScrollPosition();
              }
          );
        });
  }

  overlayConfigFactoryWithParams(object, isTransparentBg = false) {
    if(!object.keyboard) {
      Object.assign(object,{keyboard: []})
    }
    
    let o = overlayConfigFactory(object, BSModalContext);
    if (isTransparentBg){
      o.renderer = this._modalRenderer;
    }
    return o;
  }
}
