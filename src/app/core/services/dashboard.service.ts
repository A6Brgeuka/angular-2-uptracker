import { ModelService } from "../../overrides/model.service";
import { Injectable, Injector } from "@angular/core";
import { Subscribers } from "../../decorators/subscribers.decorator";
import { Restangular } from "ngx-restangular";
import { APP_CONFIG, AppConfig } from "../../app.config";
import { Observable} from "rxjs";

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class DashboardService extends ModelService {
  public appConfig: AppConfig;
  public selfData$: Observable<any>;
  public dashboardText: string;
  
  constructor(
    public injector: Injector,
    public restangular: Restangular,
  ) {
    super(restangular);
    this.appConfig = injector.get(APP_CONFIG);
    this.onInit();
  }

  onInit() {
    this.selfData$ =  this.restangular.all('dashboard').customGET()
    .filter((data:any)=>data.data && data.data.html)
    .map((data:any)=>data.data.html)
    .subscribe((text:string)=>{
      this.dashboardText = text;
    })
    }
  
}
