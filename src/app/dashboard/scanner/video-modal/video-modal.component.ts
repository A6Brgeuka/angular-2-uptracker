import { Component, OnInit } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class VideoModalContext extends BSModalContext {
  public video: any;
}


@Component({
  selector: 'video-modal',
  templateUrl: './video-modal.component.html',
  styleUrls: ['./video-modal.component.scss']
})
export class VideoModal implements ModalComponent<VideoModalContext> {
  context;
  
  constructor(
    public dialog: DialogRef<VideoModalContext>,
  ) {
    this.context = dialog.context.video;
    dialog.setCloseGuard(this);
  }
}