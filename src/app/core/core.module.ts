/* tslint:disable:member-ordering no-unused-variable */
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_CONFIG, APP_DI_CONFIG } from '../app.config';
import { LOCAL_STORAGE_PROVIDERS } from 'angular2-local-storage/local_storage';
import { CookieService } from 'angular2-cookie/services/cookies.service';
// import { ResourceModule } from 'ng2-resource-rest';

// custom modals
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule, Modal } from 'angular2-modal/plugins/bootstrap';

// import { APP_RESOLVER_PROVIDERS } from '../../app2/app.resolver';

import { APP_SERVICE_PROVIDERS } from './services/index';

@NgModule({
  imports: [
    CommonModule,
    // ResourceModule.forRoot(),
    ModalModule.forRoot(),
    BootstrapModalModule
  ],
  declarations: [  ],
  providers: [
    // AuthGuard,
    
    // app config
    { provide: APP_CONFIG, useValue: APP_DI_CONFIG },
    
    //local storage
    LOCAL_STORAGE_PROVIDERS,
  
    //resolvers
    //...APP_RESOLVER_PROVIDERS,
    
    ...APP_SERVICE_PROVIDERS,
    CookieService,
    Modal
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