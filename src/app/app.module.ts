import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { routing }  from './app.routing';
import { AppComponent } from './app.component';

// modules
import { CoreModule } from './core/core.module';
import { AppSharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { NoContentModule } from './no-content/no-content.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    // AppSharedModule,
    routing,
    AuthModule,
    NoContentModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
