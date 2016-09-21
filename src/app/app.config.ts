import { OpaqueToken } from '@angular/core';

export let APP_CONFIG = new OpaqueToken('app.config');

export interface AppConfig {
  apiEndpoint: string;
}

export let qqq = {
  qqq:111
}

export const APP_DI_CONFIG: AppConfig = {
  // apiEndpoint: process.env.API_URL,
  // apiEndpoint: 'http://private-anon-ce8323ff87-uptracker.apiary-mock.com/api/v1'
  apiEndpoint: 'http://uptracker-api.herokuapp.com/api/v1'
};
