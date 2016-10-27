import { HttpClient } from './http.service';
import { ToasterService } from './toaster.service';
import { UserService } from './user.service';
import { AccountService } from './account.service';
import { CardService } from './card.service';
import { StateService } from './state.service';
import { SpinnerService } from './spinner.service';
import { PhoneMaskService } from './phone-mask.service';
import { StreetViewService } from './street-view.service';


export {
  HttpClient,
  ToasterService,
  UserService,
  AccountService,
  CardService,
  StateService,
  SpinnerService,
  PhoneMaskService,
  StreetViewService
};

// an array of services to resolve routes with data
export const APP_SERVICE_PROVIDERS = [
  HttpClient,
  ToasterService,
  UserService,
  AccountService,
  CardService,
  StateService,
  SpinnerService,
  PhoneMaskService,
  StreetViewService
];