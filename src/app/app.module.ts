import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { routing }  from './app.routing';
import { AppComponent } from './app.component';

// modules
import { ResourceModule } from 'ng2-resource-rest';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { NoContentModule } from './no-content/no-content.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { OnboardModule } from './onboard/onboard.module';
import { SpinnerModule } from './spinner/spinner.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    routing,
    ResourceModule.forRoot(),

    AuthModule,
    NoContentModule,
    DashboardModule,
    OnboardModule,
    SpinnerModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
