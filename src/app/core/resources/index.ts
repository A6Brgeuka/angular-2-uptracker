import { UserResource } from './user.resource';
import { AccountResource } from './account.resource';
import { CardResource } from './card.resource';
import { StreetViewResource } from './street-view.resource';
import { VendorResource } from './vendor.resource';


export {
  UserResource,
  AccountResource,
  CardResource,
  StreetViewResource,
  VendorResource
};

// an array of services to resolve routes with data
export const APP_RESOURCE_PROVIDERS = [
  UserResource,
  AccountResource,
  CardResource,
  StreetViewResource,
  VendorResource
];