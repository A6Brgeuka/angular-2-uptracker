import { ModelService } from "../../overrides/model.service";
import { Injectable, Injector } from "@angular/core";
import { Subscribers } from "../../decorators/subscribers.decorator";
import { Restangular } from "ng2-restangular";
import { AppConfig, APP_CONFIG } from "../../app.config";
import { Observable } from "rxjs";

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class LocationService extends ModelService {


  public appConfig: AppConfig;


  constructor(

    public injector: Injector,
    public restangular: Restangular
  ) {
    super(restangular);

    this.appConfig = injector.get(APP_CONFIG);

  }


  getLocationStreetView(params) {
    debugger;
    return this.restangular.oneUrl("street", this.getLocationStreetViewUrl(params)).customGET()
      .map(res => {
        debugger;
      });
    // var xhr = new XMLHttpRequest();
    // xhr.responseType = 'blob';
    // xhr.onload = () => {
    //   var reader = new FileReader();
    //   reader.onloadend = () => {
    //     return Observable.of(reader.result);
    //   };
    //   reader.readAsDataURL(xhr.response);
    // };
    // xhr.open('GET', this.getLocationStreetViewUrl(params));
    // xhr.send();
  }

  getLocationStreetViewUrl(params) {
    params.key = this.appConfig.streetView.apiKey;
    params.size = '520x293';
    // this.restangular
    //     .oneUrl('street', 'https://maps.googleapis.com/maps/api/streetview/metadata')
    //     .get({location: params.location, size: params.size, key: params.key})
    //     .subscribe((res: any) => {
    //       debugger;
    let imageUrl = this.appConfig.streetView.endpoint + '?size=' + params.size + '&key=' + params.key + '&location=' + params.location;
    return imageUrl.replace(/\s/g,'%20').replace(/#/g, '');
    // });
  }
}
