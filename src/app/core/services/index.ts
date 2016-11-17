// import { HttpClient } from './http.service';
import { ToasterService } from './toaster.service';
import { UserService } from './user.service';
import { AccountService } from './account.service';
import { CardService } from './card.service';
import { StateService } from './state.service';
import { SpinnerService } from './spinner.service';
import { PhoneMaskService } from './phone-mask.service';
import { SessionService } from './session.service';
import { FileUploadService } from './file-upload.service';
import { ExifService } from './exif.service';
import { VendorService } from './vendor.service';


export {
  ToasterService,
  UserService,
  SessionService,
  SpinnerService,
  AccountService,
  CardService,
  StateService,
  PhoneMaskService,
  FileUploadService,
  ExifService,
  // HttpClient,
  VendorService
};

// an array of services to resolve routes with data
export const APP_SERVICE_PROVIDERS = [
  ToasterService,
  UserService,
  SessionService,
  SpinnerService,
  AccountService,
  CardService,
  StateService,
  PhoneMaskService,
  FileUploadService,
  ExifService,
  // HttpClient,
  VendorService
];