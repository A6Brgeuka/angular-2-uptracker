import { UserResource } from './user.resource';
import { AccountResource } from './account.resource';
import { CardResource } from './card.resource';


export {
  UserResource,
  AccountResource,
  CardResource
};

// an array of services to resolve routes with data
export const APP_RESOURCE_PROVIDERS = [
  UserResource,
  AccountResource,
  CardResource
];