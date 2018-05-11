import { Component, OnInit } from "@angular/core";
import {ModalComponent, DialogRef, Modal} from "angular2-modal";
import { BSModalContext } from "angular2-modal/plugins/bootstrap";
import { HttpClient } from "app/core/services/http.service";
import { ResponseContentType } from "@angular/http";
import { APP_DI_CONFIG } from '../../../../../../env';
import { ToasterService } from "../../../../core/services/toaster.service";
import { SpinnerService } from "../../../../core/services";
import { UserService } from "../../../../core/services/user.service";
import { EditEmailDataModal } from "../purchase-order/edit-email-data-modal/edit-email-data-modal.component";
import { ModalWindowService } from "../../../../core/services/modal-window.service";
import { OrderItems } from '../models/converted-order';

export class WarningOrderModalContext extends BSModalContext {
  public order: OrderItems;
  public status: any;
  constructor(order: OrderItems) {
   super();
    this.order = order;
    this.status = status;
  }
}

@Component({
  selector: 'app-warning-order-modal',
  templateUrl: './warning-order-modal.component.html',
  styleUrls: ['./warning-order-modal.component.scss']
})
export class WarningOrderModalComponent implements OnInit, ModalComponent<WarningOrderModalContext> {
  context: WarningOrderModalContext;

  constructor(
    public dialog: DialogRef<WarningOrderModalContext>,
    public httpClient: HttpClient,
    public toasterService: ToasterService,
    public spinner: SpinnerService,
    public userService: UserService,
    public modalWindowService: ModalWindowService,
    public modal: Modal
  ) {
    this.context = dialog.context;
  }

  ngOnInit() {
  }

  showPo() {
    const order = this.context.order;
    const status = this.context.status;
    this.showEmailDataEditModal({
      order_method:order['order_method'],
      attachments: order['attachments'],
      email_text: "",
      po_number: order['po_number'],
      preview_id: order['preview_id'],
      order_id: order['id'],
      vendor_email: order['vendor_email_address'],
      user_email: this.userService.selfData.email_address,
      from_fax_number: order['from_fax_number'] || '1 11111111111',
      rmFn:  null
    });
    this.dialog.dismiss();
  }

  dismissModal() {
    this.toasterService.pop('', 'Order processed. Pending receiving');
    this.dialog.dismiss();
  }

  closeModal() {
    let ua = navigator.userAgent.toLowerCase();
    let isSafari = ua.indexOf('safari') != -1;
    let w: Window;
    if (isSafari) {
      w = window.open();
    }

    this.spinner.show();
    return this.httpClient.get(APP_DI_CONFIG.apiEndpoint + '/po/' + this.context.order.id + '/download', {
      responseType: ResponseContentType.ArrayBuffer
    })
    .subscribe(res => {
      let file = new Blob([res.arrayBuffer()], {type: 'application/pdf'});
      let pdfUrl = window.URL.createObjectURL(file);
      if (isSafari) {
        setTimeout(() => {
          w.print();
        }, 500);
        w.location.assign(pdfUrl);
      } else {
        w = window.open(pdfUrl);
        w.print();
      }

      this.spinner.hide();
      this.dialog.close();
      this.modalWindowService.confirmModal$.next(true);
    });
  }

  showEmailDataEditModal(data) {
    if (!data.email_text) {
      data.email_text = "Email text"
    }
    if (!data.po_number) {
      data.po_number = "1234567890"
    }
    this.modal.open(EditEmailDataModal, this.modalWindowService.overlayConfigFactoryWithParams(data, true, "oldschool"));
  }

}
