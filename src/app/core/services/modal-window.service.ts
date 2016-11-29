import { Injectable } from '@angular/core';
import { Modal } from 'angular2-modal/plugins/bootstrap';

@Injectable()
export class ModalWindowService {
  constructor(
      public modal: Modal
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
              (err)=>{
              }
          );
        });
  }
}
