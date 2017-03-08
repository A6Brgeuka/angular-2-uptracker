import { Injectable, ViewContainerRef } from '@angular/core';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Subject } from 'rxjs/Rx';

@Injectable()
export class ModalWindowService {
  private scrollTop$: Subject<any> = new Subject<any>();
  private scrollTop: number;

  constructor(
      public modal: Modal,
      private overlay: Overlay
  ) {
  }
  
  confirmModal(title, body = '', fn = () => {}){
    this.modal.confirm()
        .isBlocking(false)
        .showClose(false)
        .keyboard(27)
        .dialogClass('modal-confirm')
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
    this.overlay.defaultViewContainer = vcRef;
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
    return overlayConfigFactory(object, BSModalContext)
  }
}
