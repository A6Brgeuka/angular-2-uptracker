import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RouterModule } from '@angular/router';
import { ModalModule } from 'angular2-modal';
import { HomeComponent } from './home.component';
import { PageModule } from './page/page.module';
import { AppSharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    AppSharedModule,
    PageModule
  ],
  providers: [],
})
export class HomeModule { }
