import { UserResource } from './user.resource';
import { AccountResource } from './account.resource';


export {
  UserResource,
  AccountResource
};

// an array of services to resolve routes with data
export const APP_RESOURCE_PROVIDERS = [
  UserResource,
  AccountResource
];