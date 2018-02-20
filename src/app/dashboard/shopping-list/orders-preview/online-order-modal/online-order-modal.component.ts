import { Component, OnInit } from "@angular/core";
import { DestroySubscribers } from "ng2-destroy-subscribers";
import { CloseGuard, ModalComponent, DialogRef } from "angular2-modal";
import { BSModalContext } from "angular2-modal/plugins/bootstrap";
import { HttpClient } from "app/core/services/http.service";
import { ResponseContentType } from "@angular/http";
import { APP_DI_CONFIG } from '../../../../../../env';
import { SpinnerService, OrderService, VendorService } from "../../../../core/services";
import { ActivatedRoute, Router, Params } from "@angular/router";

export class OnlineOrderModalContext extends BSModalContext {
  public order_id: string;
  public vendor_id: string;
  constructor(o: string, v: string) {
   super();
    this.order_id = o;
    this.vendor_id = v;
  }
}

@Component({
  selector: 'app-online-order-modal',
  templateUrl: './online-order-modal.component.html',
  styleUrls: ['./online-order-modal.component.scss']
})
@DestroySubscribers()
export class OnlineOrderModalComponent implements OnInit, CloseGuard, ModalComponent<OnlineOrderModalContext> {
  context: OnlineOrderModalContext;
  action: "Go to website" | "Email" | "Print" = "Email";

  constructor(
    public dialog: DialogRef<OnlineOrderModalContext>,
    public httpClient: HttpClient,
    public spinner: SpinnerService,
    public orderService: OrderService,
    public vendorService: VendorService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }
  
  ngOnInit() {
  }
  
  
  closeModal() {
    switch (this.action) {
      case "Go to website":
        this.vendorService.getVendor(this.context.vendor_id).subscribe(vendor => {
          window.open(vendor.website);
          this.dialog.close();
        });
        break;
      case "Email": 
        this.route.params.subscribe((p: Params)=>{
          this.router.navigate(['/shoppinglist','purchase', this.context.order_id]);
          this.dialog.close();
        });
        break;
      case "Print":
        this.spinner.show();
        this.orderService.convertOrders(this.context.order_id, this.orderService.convertData)
        .map(res => res.data.order)
        .switchMap(order => {
          return this.orderService.sendOrderRequest(order.id)
          .switchMap(res => {
            return this.httpClient.get(APP_DI_CONFIG.apiEndpoint + '/po/' + order.id + '/download', {
              responseType: ResponseContentType.ArrayBuffer
            });
          });
        })
        .subscribe((res) => { 
          let file = new Blob([res.arrayBuffer()], {type: 'application/pdf'});
          let w = window.open(window.URL.createObjectURL(file));
          w.print();
          this.spinner.hide();
          this.dialog.close();
        }, (res: any) => { })
        break;
      default:
        break;
    }
    
  }
  
}