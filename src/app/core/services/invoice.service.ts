import {Injectable, Inject} from "@angular/core";
import {HttpClient} from "./http.service";
import {ToasterService} from "./toaster.service";
import {APP_CONFIG, AppConfig} from "../../app.config";
import {ModelService} from "../../overrides/ModelService.ts";

@Injectable()
export class InvoiceService extends ModelService {
  
  constructor(
    public http:HttpClient,
    public toasterService:ToasterService,
    @Inject(APP_CONFIG) appConfig:AppConfig
  ) {
    super({
      childClassName: InvoiceService.name,
      modelEndpoint: 'invoices',
      expand: {
        default: [
          'deployment',
          {
            'Invoice': [
              'deploymentInvoices',
              'payment'
            ],
            'Payment': [
              'card'
            ]
          },
        ],
      }
    }, http, toasterService, appConfig);
  
    this.onInit();
  }
  
  onInit() {
  }
  
  createPdfUrl(id){
    return `${this.apiEndpoint}/${id}/create-pdf`;
  }
}