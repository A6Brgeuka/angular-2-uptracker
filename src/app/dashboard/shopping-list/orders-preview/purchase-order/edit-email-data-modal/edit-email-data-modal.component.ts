import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

export class EditEmailDataModalContext extends BSModalContext {
  public product: any;
}

@Component({
  selector: 'edit-email-data-modal',
  templateUrl: './edit-email-data-modal.component.html',
  styleUrls: ['./edit-email-data-modal.component.scss']
})
@DestroySubscribers()
export class EditEmailDataModal implements OnInit, AfterViewInit, CloseGuard, ModalComponent<EditEmailDataModalContext> {
  public subscribers: any = {};
  context: EditEmailDataModalContext;

  constructor(
      public dialog: DialogRef<EditEmailDataModalContext>,
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit(){
  }

  ngAfterViewInit(){
  }

  dismissModal(){
    this.dialog.dismiss();
  }

  closeModal(data){
    this.dialog.close(data);
  }

  changeName(event) {
  }

}
