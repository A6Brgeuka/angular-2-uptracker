import { NgModule } from '@angular/core';

import { routing }  from './app.routing';
import { AppComponent } from './app.component';

// modules
import { AppSharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { NoContentModule } from './no-content/no-content.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppSharedModule,
    routing,
    AuthModule,
    NoContentModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
