import { Component, Compiler, Injector } from '@angular/core';
import { Modal, overlayConfigFactory } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { CustomModal } from './custom-modal';

@Component({
  selector: 'app-embeded',
  templateUrl: './embeded.component.html'
})
export class EmbededComponent {
  constructor(public modal: Modal, public compiler: Compiler, public injector: Injector){
    
  }
  
  openModal(){
    this.modal.open(CustomModal, overlayConfigFactory({ isBlocking: false }, BSModalContext))
  }
}
