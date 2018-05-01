import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalComponent, Modal} from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { ModalWindowService } from '../../../core/services/modal-window.service';

export class UploadEditImageModalContext extends BSModalContext {

}
@Component({
  selector: 'app-upload-edit-image-modal',
  templateUrl: './upload-edit-image-modal.component.html',
  styleUrls: ['./upload-edit-image-modal.component.scss']
})
export class UploadEditImageModalComponent implements OnInit, ModalComponent<UploadEditImageModalContext> {

  context: UploadEditImageModalContext;
  product: any;
  constructor(public dialog: DialogRef<UploadEditImageModalContext>,
              public modalWindowService: ModalWindowService,
              public modal: Modal) {
   this.context = dialog.context;
  }

  ngOnInit() {
    this.product = this.context;
    console.log(this.product);
  }

  dismissModal() {
    this.dialog.close(this.product.image);
  }

  onSubmit() {
    this.dialog.close();
  }
}
