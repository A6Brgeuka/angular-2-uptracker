// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { routing }  from './app.routing';
import { AppComponent } from './app.component';

// modules
import { CoreModule } from './core/core.module';
import { NoContentModule } from './no-content/no-content.module';
import { AuthModule } from './auth/auth.module';
import { SpinnerModule } from './spinner/spinner.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // BrowserModule,
    CoreModule,
    routing,

    AuthModule,
    NoContentModule,
    SpinnerModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
