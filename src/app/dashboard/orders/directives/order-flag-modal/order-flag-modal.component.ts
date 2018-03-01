import { Component } from '@angular/core';

import { CloseGuard, DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export class OrderFlagModalContext extends BSModalContext {
  public flagged_comment: FlaggedComment[];
}

export interface FlaggedComment {
  comment: string;
  user_id: string;
  user_name: string;
  date: string;
}

@Component({
  selector: 'app-order-flag-modal',
  templateUrl: './order-flag-modal.component.html',
  styleUrls: ['./order-flag-modal.component.scss'],
})
export class OrderFlagModalComponent implements CloseGuard, ModalComponent<OrderFlagModalContext> {
  context;
  public comments: FlaggedComment[];
  public form: FormGroup;

  constructor(
    public dialog: DialogRef<OrderFlagModalContext>,
  ) {
    this.context = dialog.context;
    this.form = new FormGroup({
      comment: new FormControl('', Validators.required)
    });
    console.log(this.context);
  }

  get commentControl() {
    return this.form.get('comment');
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialog.close(this.form.value);
    }
  }
}
