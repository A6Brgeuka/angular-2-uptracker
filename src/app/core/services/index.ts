import { HttpClient } from './http.service';
import { ToasterService } from './toaster.service';
import { UserService } from './user.service';
import { CardService } from './card.service';
import { StateService } from './state.service';
// import { TokenService } from './token.service';
// import { InvoiceService } from './invoice.service';


export {
  HttpClient,
  ToasterService,
  UserService,
  CardService,
  StateService,
  // TokenService,
  // InvoiceService
};

// an array of services to resolve routes with data
export const APP_SERVICE_PROVIDERS = [
  HttpClient,
  ToasterService,
  UserService,
  CardService,
  StateService,
  // TokenService,
  // InvoiceService
];