import {Injectable, Inject} from "@angular/core";
import {HttpClient} from "./http.service";
import {ToasterService} from "./toaster.service";
import {APP_CONFIG, AppConfig} from "../../app.config";

import {ModelService} from "../../overrides/ModelService.ts";

@Injectable()
export class TokenService extends ModelService{
  
  constructor(
    public http:HttpClient,
    public toasterService:ToasterService,
    @Inject(APP_CONFIG) appConfig:AppConfig
  ) {
    super({
      childClassName: TokenService.name,
      modelEndpoint: 'tokens',
      expand: {
        default: [],
      }
    }, http, toasterService, appConfig);
  
    this.onInit();
  }
  
  onInit(){
  }
}