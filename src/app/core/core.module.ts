/* tslint:disable:member-ordering no-unused-variable */
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { LOCAL_STORAGE_PROVIDERS } from 'angular2-local-storage/local_storage';
// import { HttpModule } from '@angular/http';
// import { APP_CONFIG, APP_DI_CONFIG } from '../app.config';
import { MaterializeModule } from 'angular2-materialize';
import { ResourceModule } from 'ng2-resource-rest';

//import { APP_RESOLVER_PROVIDERS } from '../../app2/app.resolver';

import { APP_SERVICE_PROVIDERS } from './services/index';


@NgModule({
  imports: [
    CommonModule,
    MaterializeModule,
    ResourceModule.forRoot()
  ],
  declarations: [  ],
  providers: [
    // AuthGuard,
    
    // app config
    // {provide: APP_CONFIG, useValue: APP_DI_CONFIG},
    
    //local storage
    // LOCAL_STORAGE_PROVIDERS,
  
    //resolvers
    //...APP_RESOLVER_PROVIDERS,
    
    ...APP_SERVICE_PROVIDERS
  ]
})
export class CoreModule {
  
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}


/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */