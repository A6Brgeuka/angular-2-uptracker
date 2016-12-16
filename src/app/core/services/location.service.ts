import { ModelService } from "../../overrides/model.service";
import { Injectable, Injector } from "@angular/core";
import { Subscribers } from "../../decorators/subscribers.decorator";
import { Restangular } from "ng2-restangular";
import { AppConfig, APP_CONFIG } from "../../app.config";
import { Observable } from "rxjs";
import { Http } from "@angular/http";

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class LocationService extends ModelService {


  public appConfig: AppConfig;


  constructor(

    public injector: Injector,
    public restangular: Restangular,
    public http: Http
  ) {
    super(restangular);

    this.appConfig = injector.get(APP_CONFIG);

  }


  getLocationStreetView(params) {
    return this.http.get(this.getLocationStreetViewUrl(params, true))
  }

  getLocationStreetViewUrl(params, type?) {
    let url = this.appConfig.streetView.endpoint;
    if(type) {
      url += "/metadata";
    }
    params.key = this.appConfig.streetView.apiKey;
    params.size = '520x293';

    let imageUrl = url + '?size=' + params.size + '&key=' + params.key + '&location=' + params.location;
    return imageUrl.replace(/\s/g,'%20').replace(/#/g, '');

  }
}
