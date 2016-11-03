import { OpaqueToken } from '@angular/core';
import { SessionService } from './core/services/session.service';

export let APP_CONFIG = new OpaqueToken('app.config');

export interface AppConfig {
  apiEndpoint: string;
}

export const APP_DI_CONFIG: AppConfig = {
  // apiEndpoint: process.env.API_URL,
  apiEndpoint: 'http://uptracker-api.herokuapp.com/api/v1'
};

export function RESTANGULAR_CONFIG (RestangularProvider, sessionService: SessionService) {
  RestangularProvider.setBaseUrl(APP_DI_CONFIG.apiEndpoint);
  RestangularProvider.setDefaultResponseMethod("observable");

  RestangularProvider.addFullRequestInterceptor((element, operation, path, url, headers, params) => { debugger;
    let newHeaders = {
      'Content-Type': 'application/json',
      'X_AUTH_TOKEN': sessionService.get('uptracker_token')
    };
    // newHeaders.append('X_AUTH_TOKEN', sessionService.get('uptracker_token') || null);

    return {
      params: Object.assign({}, params, {sort:"name"}),
      headers: newHeaders,
      element: element
    }
  });

  RestangularProvider.addResponseInterceptor((data, operation, what, url, response)=> {
    return data;
  });
};